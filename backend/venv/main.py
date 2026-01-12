import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Optimized Prompt: Less "Trigger Happy", more analytical
SYSTEM_PROMPT = """
You are a Fraud Prevention Specialist. Analyze the call transcript.

YOUR TASKS:
1. Identify SCAM patterns (Urgency, Gift Cards, IRS, Bank Account).
2. If the call is normal conversation, Risk Score must be < 10.
3. If suspicious but vague, Risk Score 30-60.
4. If clearly a scam, Risk Score 80-100.
5. Extract EXACT phrases from the text that triggered the flag for highlighting.

RETURN JSON ONLY:
{
  "risk_score": (integer 0-100),
  "verdict": "SAFE" / "CAUTION" / "DANGER",
  "highlight_phrases": ["exact phrase 1", "exact phrase 2"],
  "educational_warning": "One sentence explaining WHY this is a scam to a non-tech user."
}
"""

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    try:
        # 1. Transcribe
        transcription = client.audio.transcriptions.create(
            file=(file.filename, file.file.read()),
            model="whisper-large-v3-turbo",
            response_format="json"
        )
        
        # 2. Analyze
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": transcription.text}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        return {
            "transcript": transcription.text,
            "ai_analysis": completion.choices[0].message.content
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))