# app.py — EchoMind backend (FastAPI)
import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from deepgram import Deepgram
import google.generativeai as genai

load_dotenv()

# Config
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Updated with new key

if not (DEEPGRAM_API_KEY and GEMINI_API_KEY):
    raise RuntimeError("Missing one or more required env vars. Check .env")

# Clients
dg_client = Deepgram(DEEPGRAM_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="EchoMind Backend")

# CORS middleware to allow frontend communication
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Adjust to your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def call_deepgram_binary(audio_bytes: bytes, mimetype: str = "audio/wav"):
    """Send audio bytes to Deepgram synchronous endpoint using SDK v2 style."""
    source = {"buffer": audio_bytes, "mimetype": mimetype}
    # Use a simple model; adjust options if needed
    response = dg_client.transcription.sync_prerecorded(source, {"model": "nova"})
    return response

def call_gemini_summary(transcript: str):
    prompt = f"""
You are an assistant. Given the transcript below, produce:
1) A short summary (2-3 sentences).
2) A JSON array of actionable tasks (each task with `text` and optional `deadline` if present).
Return a JSON object with keys: "summary" (string), "tasks" (array of {"text","deadline"}).
Transcript:
{transcript}
"""
    model = genai.GenerativeModel("gemini-1.5-flash")
    resp = model.generate_content(prompt)
    text = resp.text.strip()

    # Detect and strip triple backtick code block wrappers
    if text.startswith("```") and text.endswith("```"):
        text = text.split("\n", 1)[-1].rsplit("\n", 1)[0].strip()

    try:
        # Safely parse the JSON
        parsed = json.loads(text)
        # Ensure the parsed object has the expected keys
        if "summary" in parsed and "tasks" in parsed:
            return {
                "summary": parsed.get("summary", ""),
                "tasks": parsed.get("tasks", [])
            }
        else:
            # Log unexpected structure
            print("Unexpected Gemini output structure:", parsed)
            return {"summary": "", "tasks": []}
    except json.JSONDecodeError:
        # Log the error and return raw text if JSON parsing fails
        print("Failed to parse JSON from Gemini output:", text)
        return {"summary_and_tasks_text": text}

@app.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    # Basic validation
    if file.content_type not in ("audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp3", "audio/mpeg3", "audio/webm"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Use WAV, MP3, or WebM.")

    audio_bytes = await file.read()
    print(f"Received file type: {file.content_type}")  # Log the received file type
    # 1) Transcribe with Deepgram
    try:
        dg_resp = call_deepgram_binary(audio_bytes, mimetype=file.content_type)
        transcript = dg_resp["results"]["channels"][0]["alternatives"][0]["transcript"].strip()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Deepgram error: {e}")

    # 2) Summarize + extract tasks with Gemini
    import logging
    try:
        gemini_out = call_gemini_summary(transcript)
        logging.info(f"Gemini output: {gemini_out}")
        summary = ""
        tasks = []
        if isinstance(gemini_out, dict):
            # Case 1: Flat structure
            if isinstance(gemini_out.get("summary"), str) and isinstance(gemini_out.get("tasks"), list):
                summary = gemini_out["summary"]
                tasks = gemini_out["tasks"]
            # Case 2: Nested summary object
            elif isinstance(gemini_out.get("summary"), dict):
                summary_obj = gemini_out["summary"]
                summary = summary_obj.get("summary", "")
                tasks = summary_obj.get("tasks", [])
            # Case 3: Fallback to summary_and_tasks_text
            elif "summary_and_tasks_text" in gemini_out:
                summary = gemini_out["summary_and_tasks_text"]
                tasks = []
            else:
                logging.error(f"Unexpected Gemini output structure: {gemini_out}")
        else:
            logging.error(f"Gemini output is not a dict: {gemini_out}")
        # Ensure types
        if not isinstance(summary, str):
            logging.error(f"Summary is not a string: {summary}")
            summary = str(summary)
        if not isinstance(tasks, list):
            logging.error(f"Tasks is not a list: {tasks}")
            tasks = []
        # Validate each task
        valid_tasks = []
        for t in tasks:
            if isinstance(t, dict) and "text" in t:
                valid_tasks.append({
                    "text": str(t["text"]),
                    "deadline": t.get("deadline")
                })
            else:
                logging.warning(f"Invalid task format: {t}")
        tasks = valid_tasks
        logging.info(f"Final summary: {summary}")
        logging.info(f"Final tasks: {tasks}")
    except Exception as e:
        logging.error(f"Gemini error: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}")

    # 3) Return structured result
    final_response = {
        "transcript": transcript,
        "summary": summary,
        "tasks": tasks
    }
    print("Returning response to frontend:", json.dumps(final_response, indent=2))
    return JSONResponse(final_response)

@app.get("/")
async def root():
    return {"message": "Welcome to EchoMind API!"}
