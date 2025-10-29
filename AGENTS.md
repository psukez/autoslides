# Agents and Workflows

This document outlines the AI backend, agents, and n8n workflows used in the AutoSlides project.

## AI Backend

The FastAPI backend (`backend.py`) provides REST endpoints for AI slide generation.

- **Technology**: FastAPI with Google Gemini AI
- **Endpoints**:
  - `GET /`: Health check
  - `GET /health`: Detailed health status
  - `POST /generate-slides`: Generate slides from content
  - `POST /generate-summary`: Generate brief summary of text content
- **Environment Variables**:
  - `GOOGLE_AI_API_KEY`: Google AI API key for Gemini
  - `PORT`: Server port (default 8000)

## AI Agent

The core AI agent (`ai_agent.py`) processes extracted content and generates structured slide content using Google Gemini AI.

- **Functions**:
  - `generate_slides()`: Creates presentation slides from content
  - `generate_summary()`: Creates brief summaries of text content
- **Input**: Raw text content
- **Output**: JSON with slides containing title, bullet points, images, and tables; or summary text
- **Configuration**: Supports customization of slide count, templates, and summary length

## n8n Workflows

### Content Extraction Workflows

- **PDF Extractor**: Extracts text and images from PDF files.
- **Web Scraper**: Scrapes content from web pages.
- **YouTube Transcript Fetcher**: Retrieves transcripts and metadata from YouTube videos.

### Processing Workflow

- **Content Processor**: Cleans and preprocesses extracted content for AI input.

### Generation and Export Workflow

- **Slide Generator**: Uses the AI agent to create slides.
- **Exporter**: Exports generated slides to Google Slides or PowerPoint format.

## Commands

### Backend API
- To start the backend server: `python backend.py`
- To generate slides via API:
  ```bash
  curl -X POST http://localhost:8000/generate-slides \
    -H "Content-Type: application/json" \
    -d '{"content": "Your content", "slide_count": 5}'
  ```

- To generate summary via API:
  ```bash
  curl -X POST http://localhost:8000/generate-summary \
    -H "Content-Type: application/json" \
    -d '{"content": "Your long text content", "max_length": 50}'
  ```

### AI Agent (Direct)
- To run the AI agent directly: `python ai_agent.py <content_file> [slide_count] [template]`

### n8n Webhooks
- To trigger PDF extraction: `curl -X POST https://n8n.spektra.ddns.net/webhook/pdf-extract -H "Content-Type: application/json" -d '{"data": "<base64_pdf>"}'`
- To trigger web scraping: `curl -X POST https://n8n.spektra.ddns.net/webhook/web-scrape -H "Content-Type: application/json" -d '{"url": "https://example.com"}'`
- To trigger YouTube processing: `curl -X POST https://n8n.spektra.ddns.net/webhook/youtube-transcript -H "Content-Type: application/json" -d '{"videoId": "VIDEO_ID"}'`
- To trigger content processing: `curl -X POST https://n8n.spektra.ddns.net/webhook/content-process -H "Content-Type: application/json" -d '{"text": "content here"}'`
- To trigger slide generation: `curl -X POST https://n8n.spektra.ddns.net/webhook/generate-slides -H "Content-Type: application/json" -d '{"content": "processed content", "slideCount": 5}'`
- To trigger export: `curl -X POST https://n8n.spektra.ddns.net/webhook/export-slides -H "Content-Type: application/json" -d '{"title": "My Presentation"}'`
- To run the full AutoSlides process: `curl -X POST https://n8n.spektra.ddns.net/webhook/autoslides -H "Content-Type: application/json" -d '{"inputType": "pdf", "data": "<pdf_data>"}'`

### Frontend
- To start development server: `cd autoslides-frontend && npm start`
- To build for production: `cd autoslides-frontend && npm run build`

Note: Workflows need to be activated in n8n, API credentials configured, and backend server running for full functionality.