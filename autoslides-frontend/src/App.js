import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [file, setFile] = useState(null);
  const [slideCount, setSlideCount] = useState(5);
  const [template, setTemplate] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slides, setSlides] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSlides([]);

    try {
      let requestData = {
        slide_count: slideCount,
        template: template
      };

      // Handle different input types
      if (inputType === 'text') {
        requestData.content = content;
      } else if (inputType === 'url') {
        requestData.url = url;
      } else if (inputType === 'youtube') {
        requestData.videoId = videoId;
      } else if (inputType === 'pdf' && file) {
        // For file upload, we'd need to handle base64 encoding
        // This is a placeholder - actual implementation would require file handling
        setError('PDF upload not yet implemented in frontend');
        setLoading(false);
        return;
      }

      // Call the backend API
      const response = await fetch('http://localhost:8000/generate-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSlides(data.slides || []);
      }
    } catch (err) {
      setError(`Failed to generate slides: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>AutoSlides</h1>
        <p>AI-powered presentation generator</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="inputType">Input Type:</label>
          <select
            id="inputType"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="text">Text Content</option>
            <option value="url">Web URL</option>
            <option value="youtube">YouTube Video</option>
            <option value="pdf">PDF File</option>
          </select>
        </div>

        {inputType === 'text' && (
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here..."
              rows="10"
              required
            />
          </div>
        )}

        {inputType === 'url' && (
          <div className="form-group">
            <label htmlFor="url">Web URL:</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
        )}

        {inputType === 'youtube' && (
          <div className="form-group">
            <label htmlFor="videoId">YouTube Video ID:</label>
            <input
              type="text"
              id="videoId"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="dQw4w9WgXcQ"
              required
            />
          </div>
        )}

        {inputType === 'pdf' && (
          <div className="form-group">
            <label htmlFor="file">PDF File:</label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="slideCount">Number of Slides:</label>
          <input
            type="number"
            id="slideCount"
            value={slideCount}
            onChange={(e) => setSlideCount(parseInt(e.target.value))}
            min="1"
            max="20"
          />
        </div>

        <div className="form-group">
          <label htmlFor="template">Template:</label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Generating Slides...' : 'Generate Slides'}
        </button>
      </form>

      {loading && <div className="loading">Generating your slides...</div>}

      {error && <div className="error">{error}</div>}

      {slides.length > 0 && (
        <div className="slides-container">
          <h2>Generated Slides</h2>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <h3>{slide.title}</h3>
              <ul>
                {slide.content && slide.content.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              {slide.image && (
                <div>
                  <strong>Image:</strong> {slide.image}
                </div>
              )}
              {slide.table && (
                <div>
                  <strong>Table:</strong>
                  <table>
                    <thead>
                      <tr>
                        {slide.table.headers && slide.table.headers.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {slide.table.rows && slide.table.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;