# Agents and Workflows

This document outlines the AI backend, agents, n8n workflows, and recent developments in the AutoSlides project.

## Recent Changes and Direction

The application has evolved significantly:
- **Source Management**: AI-generated titles for sources, with adjustable weights and usage analytics.
- **User Customization**: Presentation goals textarea to guide AI generation.
- **UI Enhancements**: Loading indicators, modal content views, bilingual support.
- **AI Improvements**: Multi-source processing with weighted contributions and goal-based generation.
- **Future Focus**: Enhanced export options, better content processing, and advanced AI features.

## AI Backend

The FastAPI backend (`backend.py`) provides REST endpoints for AI-powered slide and content generation.

- **Technology**: FastAPI with Google Gemini AI
- **Endpoints**:
  - `GET /`: Health check
  - `GET /health`: Detailed health status
  - `POST /generate-slides`: Generate slides from multiple sources with weights and goals
  - `POST /generate-title`: Generate concise title (max 10 words) for content
- **Environment Variables**:
  - `GOOGLE_AI_API_KEY`: Google AI API key for Gemini
  - `PORT`: Server port (default 8000)

## AI Agent

The core AI agent (`ai_agent.py`) processes multiple content sources and generates customized presentations using Google Gemini AI.

- **Functions**:
  - `generate_slides()`: Creates presentation slides from weighted sources, respecting user goals
  - `generate_title()`: Creates concise titles (max 10 words) for content
- **Input**: List of sources with types/values, optional weights and presentation goals
- **Output**: JSON with slides (title, content, images, tables), and source usage percentages
- **Configuration**: Supports slide count, templates, language, source weighting, and goal-based generation

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

**Deployment Note**: The application runs on a separate LXC container (IP: 192.168.1.92) with Caddy reverse proxy. Commands below are for the LXC environment.

### Backend API
- To start the backend server: `python3 backend.py`
- To generate slides via API (with sources, weights, goal):
  ```bash
  curl -X POST http://localhost:8000/generate-slides \
    -H "Content-Type: application/json" \
    -d '{
      "sources": [{"type": "text", "value": "Content 1"}, {"type": "url", "value": "https://example.com"}],
      "weights": [60, 40],
      "presentation_goal": "Educational presentation",
      "slide_count": 5,
      "language": "english"
    }'
  ```

- To generate title via API:
  ```bash
  curl -X POST http://localhost:8000/generate-title \
    -H "Content-Type: application/json" \
    -d '{"content": "Your long text content"}'
  ```

### Updating the LXC
Since the LXC is on a different device, updates require SSH access:
1. `ssh root@192.168.1.92`
2. `cd /opt/autoslides && git pull origin main`
3. `cd autoslides-frontend && npm run build`
4. `pkill -f "python3 backend.py" && python3 backend.py &`
5. `sudo systemctl restart caddy`

### AI Agent (Direct)
- To run the AI agent directly: `python3 ai_agent.py <content_file> [slide_count] [template]`

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