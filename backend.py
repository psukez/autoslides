#!/usr/bin/env python3
"""
AutoSlides Backend API

FastAPI server that provides endpoints for AI slide generation.
Runs the AI agent server-side in Proxmox LXC.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import os
from ai_agent import AutoSlidesAgent

app = FastAPI(title="AutoSlides API", description="AI-powered slide generation API", version="1.0.0")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI agent
agent = None

@app.on_event("startup")
async def startup_event():
    global agent
    try:
        agent = AutoSlidesAgent()
        print("AI Agent initialized successfully")
    except Exception as e:
        print(f"Failed to initialize AI agent: {e}")
        # Continue without agent - endpoints will return errors

class SlideRequest(BaseModel):
    content: str
    slide_count: Optional[int] = 5
    template: Optional[str] = "default"

class SlideResponse(BaseModel):
    slides: list
    error: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "AutoSlides API", "status": "running"}

@app.get("/health")
async def health():
    if agent is None:
        return {"status": "error", "message": "AI agent not initialized"}
    return {"status": "healthy", "ai_provider": "Google Gemini"}

@app.post("/generate-slides", response_model=SlideResponse)
async def generate_slides(request: SlideRequest):
    if agent is None:
        raise HTTPException(status_code=503, detail="AI agent not available")

    try:
        result = agent.generate_slides(
            content=request.content,
            slide_count=request.slide_count or 5,
            template=request.template or "default"
        )
        return SlideResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Slide generation failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)