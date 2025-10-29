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
    addSourceButton: 'Add Source',
    removeButton: 'Remove',
    sourceTypeLabel: 'Type:',
    sourceValueLabel: 'Value:',
    sourcesTitle: 'Sources:',
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
    addSourceButton: 'Agregar Fuente',
    removeButton: 'Eliminar',
    sourceTypeLabel: 'Tipo:',
    sourceValueLabel: 'Valor:',
    sourcesTitle: 'Fuentes:',
  },
};

function App() {
  const [uiLanguage, setUiLanguage] = useState('en');
  const [sources, setSources] = useState([]);
  const [newSourceType, setNewSourceType] = useState('text');
  const [newSourceValue, setNewSourceValue] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [template, setTemplate] = useState('default');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slides, setSlides] = useState([]);

  const t = (key) => translations[uiLanguage][key] || key;

  const addSource = () => {
    if (newSourceValue.trim()) {
      setSources([...sources, { type: newSourceType, value: newSourceValue.trim() }]);
      setNewSourceValue('');
    }
  };

  const removeSource = (index) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sources.length === 0) {
      setError(t('errorPrefix') + ' ' + 'Please add at least one source');
      return;
    }
    setLoading(true);
    setError('');
    setSlides([]);

    try {
      let requestData = {
        sources: sources,
        slide_count: slideCount,
        template: template,
        language: language
      };

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

      <div className="sources-section">
        <h3>{t('sourcesTitle')}</h3>
        <div className="add-source-form">
          <select value={newSourceType} onChange={(e) => setNewSourceType(e.target.value)}>
            <option value="text">{t('textOption')}</option>
            <option value="url">{t('urlOption')}</option>
            <option value="youtube">{t('youtubeOption')}</option>
            <option value="pdf">{t('pdfOption')}</option>
          </select>
          <input
            type="text"
            value={newSourceValue}
            onChange={(e) => setNewSourceValue(e.target.value)}
            placeholder={t('sourceValueLabel')}
          />
          <button type="button" onClick={addSource} className="btn">{t('addSourceButton')}</button>
        </div>
        <ul className="sources-list">
          {sources.map((source, index) => (
            <li key={index} className="source-item">
              <span>{source.type}: {source.value}</span>
              <button type="button" onClick={() => removeSource(index)}>{t('removeButton')}</button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
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