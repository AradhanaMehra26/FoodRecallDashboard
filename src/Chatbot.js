import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css"; 
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about food recalls." }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true); 


  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;



  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
 
      const fdaResponse = await axios.get("https://api.fda.gov/food/enforcement.json?limit=3");

      const latestRecalls = fdaResponse.data.results
        .map(
          (recall) =>
            `🔹 **Product:** ${recall.product_description}\n🔸 **Reason:** ${recall.reason_for_recall}\n📅 **Date:** ${formatDate(recall.recall_initiation_date)}\n🏢 **Company:** ${recall.recalling_firm}`
        )
        .join("\n\n");


      const aiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an expert in food recalls. Here are the latest food recalls:\n${latestRecalls}\nAnswer user questions based on this data.`,
            },
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const botMessage = { sender: "bot", text: aiResponse.data.choices[0].message.content };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't process your request. Try again later." }]);
    }

    setInput("");
  };


  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return "N/A";
    return `${dateStr.slice(0, 4)}/${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`;
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      {/* Toggle Button */}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {}
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
            <input
              type="text"
              placeholder="Ask me about food recalls..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
