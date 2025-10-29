import React, { useState } from 'react';
import './App.css';

const translations = {
  en: {
    appTitle: 'AutoSlides',
    appDesc: 'AI-powered presentation generator',
    uiLanguageLabel: 'UI Language:',
    english: 'English',
    spanish: 'Spanish',
    inputTypeLabel: 'Input Type:',
    textOption: 'Text Content',
    urlOption: 'Web URL',
    youtubeOption: 'YouTube Video',
    pdfOption: 'PDF File',
    contentLabel: 'Content:',
    contentPlaceholder: 'Paste your content here...',
    urlLabel: 'Web URL:',
    urlPlaceholder: 'https://example.com',
    videoIdLabel: 'YouTube Video ID:',
    videoIdPlaceholder: 'dQw4w9WgXcQ',
    fileLabel: 'PDF File:',
    slideCountLabel: 'Number of Slides:',
    templateLabel: 'Template:',
    defaultOption: 'Default',
    modernOption: 'Modern',
    minimalOption: 'Minimal',
    slidesLanguageLabel: 'Slides Language:',
    generateButton: 'Generate Slides',
    generatingButton: 'Generating Slides...',
    loadingText: 'Generating your slides...',
    errorPrefix: 'Failed to generate slides:',
    slidesTitle: 'Generated Slides',
  },
  es: {
    appTitle: 'AutoSlides',
    appDesc: 'Generador de presentaciones con IA',
    uiLanguageLabel: 'Idioma de la Interfaz:',
    english: 'Inglés',
    spanish: 'Español',
    inputTypeLabel: 'Tipo de Entrada:',
    textOption: 'Contenido de Texto',
    urlOption: 'URL Web',
    youtubeOption: 'Video de YouTube',
    pdfOption: 'Archivo PDF',
    contentLabel: 'Contenido:',
    contentPlaceholder: 'Pega tu contenido aquí...',
    urlLabel: 'URL Web:',
    urlPlaceholder: 'https://ejemplo.com',
    videoIdLabel: 'ID del Video de YouTube:',
    videoIdPlaceholder: 'dQw4w9WgXcQ',
    fileLabel: 'Archivo PDF:',
    slideCountLabel: 'Número de Diapositivas:',
    templateLabel: 'Plantilla:',
    defaultOption: 'Predeterminado',
    modernOption: 'Moderno',
    minimalOption: 'Mínimo',
    slidesLanguageLabel: 'Idioma de las Diapositivas:',
    generateButton: 'Generar Diapositivas',
    generatingButton: 'Generando Diapositivas...',
    loadingText: 'Generando tus diapositivas...',
    errorPrefix: 'Error al generar diapositivas:',
    slidesTitle: 'Diapositivas Generadas',
  },
};

function App() {
  const [uiLanguage, setUiLanguage] = useState('en');
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [file, setFile] = useState(null);
  const [slideCount, setSlideCount] = useState(5);
  const [template, setTemplate] = useState('default');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slides, setSlides] = useState([]);

  const t = (key) => translations[uiLanguage][key] || key;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSlides([]);

    try {
      let requestData = {
        slide_count: slideCount,
        template: template,
        language: language
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
      const response = await fetch('/generate-slides', {
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
      setError(`${err.message}`);
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
        <h1>{t('appTitle')}</h1>
        <p>{t('appDesc')}</p>
        <div className="form-group">
          <label htmlFor="uiLanguage">{t('uiLanguageLabel')}</label>
          <select
            id="uiLanguage"
            value={uiLanguage}
            onChange={(e) => setUiLanguage(e.target.value)}
          >
            <option value="en">{t('english')}</option>
            <option value="es">{t('spanish')}</option>
          </select>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="inputType">{t('inputTypeLabel')}</label>
          <select
            id="inputType"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="text">{t('textOption')}</option>
            <option value="url">{t('urlOption')}</option>
            <option value="youtube">{t('youtubeOption')}</option>
            <option value="pdf">{t('pdfOption')}</option>
          </select>
        </div>

        {inputType === 'text' && (
          <div className="form-group">
            <label htmlFor="content">{t('contentLabel')}</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('contentPlaceholder')}
              rows="10"
              required
            />
          </div>
        )}

        {inputType === 'url' && (
          <div className="form-group">
            <label htmlFor="url">{t('urlLabel')}</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('urlPlaceholder')}
              required
            />
          </div>
        )}

        {inputType === 'youtube' && (
          <div className="form-group">
            <label htmlFor="videoId">{t('videoIdLabel')}</label>
            <input
              type="text"
              id="videoId"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder={t('videoIdPlaceholder')}
              required
            />
          </div>
        )}

        {inputType === 'pdf' && (
          <div className="form-group">
            <label htmlFor="file">{t('fileLabel')}</label>
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
          <label htmlFor="slideCount">{t('slideCountLabel')}</label>
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
          <label htmlFor="language">{t('slidesLanguageLabel')}</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">{t('english')}</option>
            <option value="spanish">{t('spanish')}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="template">{t('templateLabel')}</label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="default">{t('defaultOption')}</option>
            <option value="modern">{t('modernOption')}</option>
            <option value="minimal">{t('minimalOption')}</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? t('generatingButton') : t('generateButton')}
        </button>
      </form>

      {loading && <div className="loading">{t('loadingText')}</div>}

      {error && <div className="error">{t('errorPrefix')} {error}</div>}

      {slides.length > 0 && (
        <div className="slides-container">
          <h2>{t('slidesTitle')}</h2>
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