# EchoMind - Full Audio to Summary & Tasks Flow
import os
from dotenv import load_dotenv
from deepgram import Deepgram
import google.generativeai as genai

# Load environment variables
load_dotenv()
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Updated with new key

# Configure APIs
dg_client = Deepgram(DEEPGRAM_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)

def transcribe_audio(file_path):
    print("🎙️ EchoMind: Starting transcription...")
    with open(file_path, "rb") as audio:
        source = {"buffer": audio, "mimetype": "audio/wav"}
        response = dg_client.transcription.sync_prerecorded(source, {"model": "nova"})
    transcript = response["results"]["channels"][0]["alternatives"][0]["transcript"]
    print("\n📝 TRANSCRIPT:\n", transcript)
    return transcript

def summarize_and_extract_tasks(transcript):
    prompt = f"""
    You are an AI assistant. Given the transcript below, provide:
    1. A concise summary (2-3 sentences).
    2. A clear list of actionable tasks.
    
    Transcript:
    {transcript}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text

if __name__ == "__main__":
    audio_file = "sample.wav"  # Place your audio file here
    transcript = transcribe_audio(audio_file)
    result = summarize_and_extract_tasks(transcript)
    print("\n📄 SUMMARY & TASKS:\n", result)
