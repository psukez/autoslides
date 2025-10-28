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

[Add any specific commands or scripts here for running workflows or agents.]

Example:
- To run the n8n workflow: `n8n executeWorkflow workflow.json`