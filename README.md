# AutoSlides

AutoSlides is a project that leverages n8n workflows and a FastAPI backend to automate the creation of slide presentations from diverse sources such as PDF files, web pages, and YouTube videos. Utilizing Google Gemini AI, it generates comprehensive slides incorporating text, images, and tables, with the ability to export to Google Slides. Includes a React web frontend for easy access.

## Features

- **Multi-Source Input**: Extract content from PDFs, web pages, and YouTube videos.
- **AI-Powered Generation**: Google Gemini AI creates slide content with text, images, and tables.
- **Web Frontend**: React-based interface for uploading content and generating slides.
- **Backend API**: FastAPI server for AI processing and slide generation.
- **Customizable Output**: Set the number of slides and templates.
- **Export Options**: Generate Google Slides presentations.

## Installation

### Backend Setup
1. Install Python dependencies:
   ```bash
   pip install google-generativeai fastapi uvicorn
   ```
2. Set environment variables:
   ```bash
   export GOOGLE_AI_API_KEY="your-gemini-api-key"
   export PORT=8000
   ```
3. Run the backend:
   ```bash
   python backend.py
   ```

### n8n Workflows
1. Ensure n8n is running in a separate container (e.g., at n8n-container-ip:5678).
2. Import the AutoSlides workflows from the project.
3. Configure Google Slides API credentials in n8n.

### Frontend
1. Install Node.js and npm.
2. Navigate to `autoslides-frontend` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Serve the `build` directory with any static web server.

## Usage

### Web Interface
1. Open the React frontend in your browser.
2. Select input type (text, URL, YouTube, PDF).
3. Enter content or upload file.
4. Set slide count and template.
5. Click "Generate Slides" to create presentation.

### API Usage
```bash
curl -X POST http://localhost:8000/generate-slides \
  -H "Content-Type: application/json" \
  -d '{"content": "Your content here", "slide_count": 5}'
```

### n8n Workflows
1. Trigger the main AutoSlides workflow with input data.
2. Workflows handle content extraction and call the backend API.
3. Generated slides are exported to Google Slides.

## Contributing

Contributions are welcome. Please submit issues or pull requests on the project repository.

## License

[Specify license if applicable]