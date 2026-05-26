import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your TalkON AI assistant. I can answer questions about speech disorders and how to use this website. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message || 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl mb-4 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-2">
              <i className="fas fa-robot text-xl"></i>
              <span className="font-semibold text-lg">TalkON Assistant</span>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-purple-200 focus:outline-none transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-slate-100 text-slate-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`${
          isOpen ? 'bg-slate-800' : 'bg-purple-600 hover:bg-purple-700 animate-pulse'
        } text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
        title="Chat with AI Assistant"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots text-2xl'}`}></i>
      </button>
    </div>
  );
};

export default Chatbot;
