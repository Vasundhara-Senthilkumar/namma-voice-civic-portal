import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Send, Globe, MapPin } from 'lucide-react';
import { authFetch, normalizeComplaint } from '../apiClient';

export default function SubmitComplaint({ onComplaintSubmitted, navigateTo }) {
  const [language, setLanguage] = useState('en-IN');
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [speechError, setSpeechError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser. Voice input unavailable.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk + ' ';
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        if (finalTranscript) {
          setText((prev) => (prev ? prev.trim() + ' ' + finalTranscript.trim() : finalTranscript.trim()));
        }
        setInterimText(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'network') {
          setSpeechError('Network error during speech recognition. Please check your internet connection.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please try speaking into your microphone again.');
        } else {
          setSpeechError(`Voice recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Error initializing Speech Recognition:', err);
      setSpeechError('Failed to initialize speech recognition.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors on cleanup
        }
      }
    };
  }, [language]);

  const toggleListening = () => {
    setSpeechError(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser. Please type your complaint.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = language;
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error('Error starting recognition:', err);
          setSpeechError('Could not start microphone recording. Please check browser permissions.');
          setIsListening(false);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setSubmitError('Please enter or record a complaint description.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await authFetch(
        '/api/complaints',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.trim(),
            language,
            location: location.trim() || 'Indiranagar, Bengaluru',
          }),
        },
        navigateTo
      );

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const createdComplaint = normalizeComplaint(await response.json());
      onComplaintSubmitted(createdComplaint);
    } catch (err) {
      console.error('Failed to submit complaint:', err);
      setSubmitError(err.message || 'Failed to submit complaint. Please check server connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Submit a Civic Complaint</h2>

        {submitError && (
          <div className="alert-banner alert-error">
            <AlertCircle size={20} />
            <span>{submitError}</span>
          </div>
        )}

        {speechError && (
          <div className="alert-banner alert-error">
            <AlertCircle size={20} />
            <span>{speechError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Language Selection */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} /> Select Language for Voice Input
            </label>
            <select
              className="form-control"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isListening}
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
            </select>
          </div>

          {/* Voice & Text Complaint Input */}
          <div className="form-group">
            <div className="voice-toolbar">
              <label className="form-label" style={{ marginBottom: 0 }}>
                Complaint Description
              </label>
              <button
                type="button"
                className={`mic-btn ${isListening ? 'recording' : ''}`}
                onClick={toggleListening}
              >
                {isListening ? (
                  <>
                    <MicOff size={16} /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic size={16} /> Speak / Voice Input
                  </>
                )}
              </button>
            </div>

            {isListening && (
              <div className="listening-indicator" style={{ marginBottom: '0.5rem' }}>
                <span className="pulse-dot">●</span> Listening... Speak now ({language})
              </div>
            )}

            <textarea
              className="form-control"
              placeholder="Type your complaint here or use the Voice Input button (e.g. Water pipe broken on 4th main since 2 days...)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              required
            />

            {interimText && (
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Transcribing: "{interimText}"
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Location / Address
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Indiranagar 10th Main, Bengaluru"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Send size={18} />
            {isSubmitting ? 'Processing AI Classification...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
