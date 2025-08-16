import React from "react";
import "./Chat.css";

const Chat = ({ messages, userMessage, setUserMessage, onSendMessage }) => {
  const handleSend = () => {
    onSendMessage(userMessage);
  };

  return (
    <div className="chat-container">
      {messages.length === 0 && (
        <div className="empty-chat">Start the conversation!</div>
      )}
      
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sender === "bot" ? "bot-message" : "user-message"}`}
        >
          {msg.text}
        </div>
      ))}

      {/* <div className="chat-input">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={!userMessage.trim()}>
          Send
        </button>
      </div> */}
    </div>
  );
};

export default Chat;
