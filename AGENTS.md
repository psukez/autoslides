# Agents and Workflows

This document outlines the agents and n8n workflows used in the AutoSlides project.

## AI Agent

The core AI agent processes extracted content from various sources and generates structured slide content. It uses natural language processing to create coherent text, selects relevant images, and organizes data into tables.

- **Input**: Raw content from PDFs, web pages, YouTube transcripts.
- **Output**: Structured slide data with text, images, and tables.
- **Configuration**: Supports customization of slide count, templates, and user-provided images.

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

- To run the AI agent directly: `python ai_agent.py <content_file> [slide_count] [template]`
- To trigger PDF extraction: `curl -X POST https://n8n.spektra.ddns.net/webhook/pdf-extract -H "Content-Type: application/json" -d '{"data": "<base64_pdf>"}'`
- To trigger web scraping: `curl -X POST https://n8n.spektra.ddns.net/webhook/web-scrape -H "Content-Type: application/json" -d '{"url": "https://example.com"}'`
- To trigger YouTube processing: `curl -X POST https://n8n.spektra.ddns.net/webhook/youtube-transcript -H "Content-Type: application/json" -d '{"videoId": "VIDEO_ID"}'`
- To trigger content processing: `curl -X POST https://n8n.spektra.ddns.net/webhook/content-process -H "Content-Type: application/json" -d '{"text": "content here"}'`
- To trigger slide generation: `curl -X POST https://n8n.spektra.ddns.net/webhook/generate-slides -H "Content-Type: application/json" -d '{"content": "processed content", "slideCount": 5}'`
- To trigger export: `curl -X POST https://n8n.spektra.ddns.net/webhook/export-slides -H "Content-Type: application/json" -d '{"title": "My Presentation"}'`
- To run the full AutoSlides process: `curl -X POST https://n8n.spektra.ddns.net/webhook/autoslides -H "Content-Type: application/json" -d '{"inputType": "pdf", "data": "<pdf_data>"}'`

Note: Workflows need to be activated in n8n and API credentials configured for full functionality.