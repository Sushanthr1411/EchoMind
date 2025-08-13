# EchoMind - Transcription Module (Day 1)
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

AUDIO_FILE = "sample.wav"  # Replace with your file name

def transcribe_audio(file_path):
    # Read audio file
    with open(file_path, "rb") as audio:
        audio_bytes = audio.read()

    # Deepgram API endpoint
    url = "https://api.deepgram.com/v1/listen"
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": "audio/wav"
    }

    # Send request
    response = requests.post(url, headers=headers, data=audio_bytes)

    # Process response
    if response.status_code == 200:
        data = response.json()
        transcript = data['results']['channels'][0]['alternatives'][0]['transcript']
        return transcript
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")

if __name__ == "__main__":
    print("🎙️ EchoMind: Starting transcription...")
    result = transcribe_audio(AUDIO_FILE)
    print("\n📝 TRANSCRIPT:\n", result)
