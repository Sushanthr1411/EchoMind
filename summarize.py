# EchoMind - Summarization + Task Extraction Module
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Updated with new key

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

def summarize_and_extract_tasks(transcript):
    prompt = f"""
    You are an AI assistant. Given the transcript below, provide:
    1. A concise summary (2-3 sentences).
    2. A clear list of actionable tasks.
    
    Transcript:
    {transcript}
    """

    # Use Gemini 2.0 Flash (free tier)
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    return response.text

if __name__ == "__main__":
    # Example input
    sample_transcript = "I have a meeting at 10 AM with John and I need to finish the project report by Thursday."
    result = summarize_and_extract_tasks(sample_transcript)
    print("📄 SUMMARY & TASKS:\n", result)
