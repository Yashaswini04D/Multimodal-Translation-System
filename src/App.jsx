import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [languages, setLanguages] = useState({})
  const [isListening, setIsListening] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [translationCount, setTranslationCount] = useState(0)

  // Speech recognition setup
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    // Fetch available languages
    fetchLanguages()
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      // Language will be set dynamically based on source language selection
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }
      
      recognitionInstance.onerror = () => {
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    }
  }, [])

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/languages')
      const data = await response.json()
      setLanguages(data)
    } catch (error) {
      console.error('Error fetching languages:', error)
      // Fallback languages
      setLanguages({
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi'
      })
    }
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return
    
    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          target_language: targetLanguage,
          source_language: sourceLanguage
        }),
      })
      
      const data = await response.json()
      setTranslatedText(data.translated_text)
      setDetectedLanguage(data.detected_language)
      setConfidence(data.confidence)
      setTranslationCount(prev => prev + 1)
      
      // Show success animation
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Translation error:', error)
      setTranslatedText('Translation failed. Please try again.')
    }
    setIsTranslating(false)
  }

  // Map language codes to BCP 47 locale tags for speech recognition
  const mapToLocale = (langCode) => {
    const localeMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'hi': 'hi-IN'
    }
    return localeMap[langCode] || langCode
  }

  const startListening = () => {
    if (recognition && !isListening) {
      // Set language for speech recognition if not auto-detect
      if (sourceLanguage !== 'auto') {
        recognition.lang = mapToLocale(sourceLanguage)
      } else {
        // Don't set lang to let browser use default
        recognition.lang = 'en-US'
      }
      setIsListening(true)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const speakText = (text, lang = targetLanguage) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text)
      // Use proper BCP 47 locale for better voice selection
      utterance.lang = mapToLocale(lang)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const clearAll = () => {
    setInputText('')
    setTranslatedText('')
    setDetectedLanguage('')
    setConfidence(0)
    setShowSuccess(false)
  }

  const swapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      setSourceLanguage(targetLanguage)
      setTargetLanguage(sourceLanguage)
      setInputText(translatedText)
      setTranslatedText(inputText)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Universal Translator</h1>
        <p>Translate text and speech across languages • {translationCount} translations made</p>
      </header>

      <main className="translator-container">
        <div className="language-selector">
          <div className="language-group">
            <label>From:</label>
            <select 
              value={sourceLanguage} 
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              <option value="auto">Auto-detect</option>
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <button 
            className="swap-button" 
            onClick={swapLanguages}
            disabled={sourceLanguage === 'auto'}
            title="Swap languages"
          >
            ⇄
          </button>

          <div className="language-group">
            <label>To:</label>
            <select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="translation-area">
          <div className="input-section">
            <div className="input-header">
              <span>Input Text</span>
              <div className="input-controls">
                <button
                  className={`mic-button ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!recognition}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
                <button onClick={clearAll} title="Clear all">
                  🗑️
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your text here or click the microphone to speak..."
              rows="6"
            />
            {detectedLanguage && sourceLanguage === 'auto' && (
              <p className="detected-language">
                🎯 Detected: {languages[detectedLanguage] || detectedLanguage} 
                {confidence > 0 && (
                  <span className="confidence-indicator">
                    ({Math.round(confidence * 100)}% confident)
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="translation-controls">
            <button 
              className={`translate-button ${isTranslating ? 'translating' : ''} ${showSuccess ? 'success' : ''}`}
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
            >
              {isTranslating ? '🌟 Translating...' : showSuccess ? '✨ Success!' : '🚀 Translate'}
            </button>
          </div>

          <div className="output-section">
            <div className="output-header">
              <span>Translation</span>
              {translatedText && (
                <button
                  className="speak-button"
                  onClick={() => speakText(translatedText)}
                  title="Listen to translation"
                >
                  🔊
                </button>
              )}
            </div>
            <textarea
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              rows="6"
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Google Translate API • Speech Recognition & Synthesis</p>
      </footer>
    </div>
  )
}

export default App