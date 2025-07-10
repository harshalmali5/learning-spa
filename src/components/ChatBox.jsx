import { useState, useRef, useEffect } from "react";
import { streamGPT } from "../utils/openai";

export default function ChatBox({ subject = "general learning" }) {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const assistantMessage = { role: "assistant", content: "" };
    
    setChat(prev => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(true);

    const messages = [
      { 
        role: "system", 
        content: `You are an expert ${subject} tutor. Be encouraging, patient, and helpful. 
        Provide clear explanations and ask follow-up questions to engage the student. 
        Keep responses concise but informative.` 
      },
      ...chat,
      userMessage
    ];

    try {
      await streamGPT(messages, chunk => {
        setChat(prev => {
          const newChat = [...prev];
          newChat[newChat.length - 1].content += chunk;
          return newChat;
        });
      });
    } catch (error) {
      setChat(prev => {
        const newChat = [...prev];
        newChat[newChat.length - 1].content = "Sorry, I'm having trouble connecting right now. Please try again.";
        return newChat;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full modern-card">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">AI Tutor - {subject}</h3>
            <p className="text-blue-100 text-sm">Ask me anything about {subject}!</p>
          </div>
          <div className="text-3xl float">🤖</div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto max-h-96 space-y-4">
        {chat.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-6xl mb-4 float">🎓</div>
            <h3 className="text-xl font-semibold mb-2">Start Your Learning Journey</h3>
            <p className="text-gray-400 mb-4">Begin a conversation with your AI tutor</p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">💡 Try asking:</p>
              <p className="text-sm text-gray-500 mt-1">"Can you explain this topic?"</p>
              <p className="text-sm text-gray-500">"Help me understand this concept"</p>
            </div>
          </div>
        )}
        
        {chat.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`chat-message ${
                message.role === "user" ? "user" : "assistant"
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              {isLoading && index === chat.length - 1 && (
                <div className="flex items-center mt-2">
                  <div className="loading-spinner mr-2"></div>
                  <span className="text-sm opacity-70">AI is thinking...</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="btn-primary self-end"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{input.length}/1000</span>
        </div>
      </div>
    </div>
  );
} 