import React, { useState, useEffect } from "react";
import "./VoiceInput.css";

const VoiceInput = ({ userMessage, setUserMessage, onSend, onReset }) => {
  const [listening, setListening] = useState(false);
  let recognition;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserMessage(transcript);
        // Auto-send transcript when voice is recognized
        onSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        alert(`Error: ${event.error}`);
        setListening(false);
      };

      recognition.onend = () => setListening(false);
    } else {
      alert("Speech Recognition not supported in this browser.");
    }
  }, [onSend, setUserMessage]);

  const handleVoiceInput = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (listening) {
        recognition.stop();
        setListening(false);
      } else {
        recognition.start();
        setListening(true);
      }
    } catch (error) {
      alert("Microphone access denied. Please enable it in browser settings.");
    }
  };

  return (
    <div className="voice-input-container">
      <div className="input-wrapper">
        <button className="reset-btn" onClick={onReset}>
          🔄
        </button>
        <input
          type="text"
          value={userMessage}
          placeholder="Type or speak here..."
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button className="send-btn" onClick={() => onSend(userMessage)} disabled={!userMessage.trim()}>
          ➤
        </button>
        <button
          className={`voice-btn ${listening ? "listening" : ""}`}
          onClick={handleVoiceInput}
        >
          {listening ? "🎤" : "🎙️"}
        </button>
      </div>
    </div>
  );
};

export default VoiceInput;
