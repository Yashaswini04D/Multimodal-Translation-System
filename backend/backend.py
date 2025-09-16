from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from googletrans import Translator, LANGUAGES
from pydantic import BaseModel
from typing import List, Dict
import uvicorn

app = FastAPI(title="Translation API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize translator
translator = Translator()

class TranslationRequest(BaseModel):
    text: str
    target_language: str
    source_language: str = "auto"

class TranslationResponse(BaseModel):
    translated_text: str
    detected_language: str
    confidence: float

@app.get("/")
async def root():
    return {"message": "Translation API is running"}

@app.get("/languages")
async def get_languages() -> Dict[str, str]:
    """Get all available languages"""
    return LANGUAGES

@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """Translate text from source language to target language"""
    try:
        # Enhanced auto-detection with better confidence handling
        if request.source_language == "auto":
            # First detect language with better confidence assessment
            detection = translator.detect(request.text)
            detected_lang = detection.lang
            confidence = detection.confidence
            
            if confidence is None:
                confidence = 0.5  # or any default value you prefer
            
            # If confidence is too low, try with multiple detection attempts
            if confidence < 0.7:
                try:
                    # Try alternative detection approach
                    temp_result = translator.translate(request.text, dest='en')
                    detected_lang = temp_result.src
                    confidence = 0.8  # Reasonable confidence for successful translation
                except:
                    pass
            
            # Perform translation with detected language
            result = translator.translate(
                request.text,
                src=detected_lang,
                dest=request.target_language
            )
            
            return TranslationResponse(
                translated_text=result.text,
                detected_language=detected_lang,
                confidence=confidence
            )
        else:
            # Direct translation with specified source language
            result = translator.translate(
                request.text,
                src=request.source_language,
                dest=request.target_language
            )
            
            return TranslationResponse(
                translated_text=result.text,
                detected_language=request.source_language,
                confidence=0.95
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

@app.get("/detect")
async def detect_language(text: str):
    """Detect the language of given text"""
    try:
        detection = translator.detect(text)
        return {
            "language": detection.lang,
            "confidence": detection.confidence,
            "language_name": LANGUAGES.get(detection.lang, "Unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "backend:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )