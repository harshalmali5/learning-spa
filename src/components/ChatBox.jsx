import { useState, useRef, useEffect } from "react";
import { streamGPT } from "../utils/openai";
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export default function ChatBox({ subject = "general learning" }) {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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

  // Helper to render math using react-katex
  function renderWithMath(content) {
    // Render block math: $$...$$
    const blockMathRegex = /\$\$([\s\S]+?)\$\$/g;
    // Render inline math: \(...\) or $...$
    const inlineMathRegex = /\\\((.+?)\\\)|\$(.+?)\$/g;

    let elements = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    // Block math
    while ((match = blockMathRegex.exec(content))) {
      if (match.index > lastIndex) {
        elements.push(content.slice(lastIndex, match.index));
      }
      elements.push(<BlockMath key={key++}>{match[1]}</BlockMath>);
      lastIndex = blockMathRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      content = content.slice(lastIndex);
    } else {
      content = "";
    }
    // Inline math
    let lastInlineIndex = 0;
    let inlineElements = [];
    while ((match = inlineMathRegex.exec(content))) {
      if (match.index > lastInlineIndex) {
        inlineElements.push(content.slice(lastInlineIndex, match.index));
      }
      const mathContent = match[1] || match[2];
      inlineElements.push(<InlineMath key={key++}>{mathContent}</InlineMath>);
      lastInlineIndex = inlineMathRegex.lastIndex;
    }
    if (lastInlineIndex < content.length) {
      inlineElements.push(content.slice(lastInlineIndex));
    }
    elements = elements.concat(inlineElements);
    return elements.length > 0 ? elements : content;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">AI Tutor - {subject}</h3>
        <p className="text-sm opacity-90">Ask me anything about {subject}!</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto max-h-96" ref={chatContainerRef}>
        {chat.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">🤖</div>
            <p>Start a conversation with your AI tutor!</p>
            <p className="text-sm mt-2">Try asking: "Can you explain this topic?"</p>
          </div>
        )}
        
        {chat.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`chat-message ${
                message.role === "user" ? "user" : "assistant"
              }`}
            >
              <div className="whitespace-pre-wrap">{renderWithMath(message.content)}</div>
              {isLoading && index === chat.length - 1 && (
                <div className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 