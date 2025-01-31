import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css"; 
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about food recalls." }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true); // ✅ Toggle State for Chatbot

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5001/api/chat", { message: input });

      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't process your request. Try again later." }]);
    }

    setInput("");
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      {/* ✅ Toggle Button to Show/Hide Chatbot */}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {/* ✅ Show Chat Only When isOpen is TRUE */}
      {isOpen && (
        <div className="chat-content">
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Ask me about food recalls..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
