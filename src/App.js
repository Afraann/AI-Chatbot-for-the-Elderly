import React, { useState } from "react";
import Chat from "./Chat";
import VoiceInput from "./VoiceInput";
import { FaBell, FaCalendarAlt, FaPuzzlePiece } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am here to support you. How can I help today?" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const navigate = useNavigate();

  // Unified send function for both text and voice inputs
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setUserMessage(""); // Clear input after sending

    try {
      // Send the message to the backend
      const response = await axios.post("http://localhost:5000/chat", { message });
      // Append the bot's reply to the messages
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I encountered an error. Please try again." }
      ]);
    }
  };

  const handleReset = () => {
    setMessages([{ sender: "bot", text: "Hello! I am here to support you. How can I help today?" }]);
    setUserMessage("");
  };

  const showNotifications = () => {
    alert("🔔 You have no new notifications.");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <FaCalendarAlt className="icon" onClick={() => navigate("/addReminder")} title="Reminders" />
        <FaBell className="icon" onClick={showNotifications} title="Notifications" />
        <FaPuzzlePiece className="icon" onClick={() => navigate("/dailyPuzzle")} title="Daily Puzzle" />
      </header>
      <h1 className="app-title">ELDERLY COMPANION CHATBOT</h1>
      <Chat 
        messages={messages} 
        userMessage={userMessage} 
        setUserMessage={setUserMessage} 
        onSendMessage={handleSendMessage} 
      />
      <VoiceInput 
        userMessage={userMessage} 
        setUserMessage={setUserMessage} 
        onSend={handleSendMessage} 
        onReset={handleReset} 
      />
    </div>
  );
}

export default App;
