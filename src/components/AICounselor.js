import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AICounselor = () => {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: "Hi! I'm your AI Career Counselor powered by Google's Gemini AI. I can provide personalized career guidance based on your interests, skills, and goals. How can I help you today?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare conversation history for Gemini
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Call Gemini API
      const response = await axios.post('/api/chatgpt/chat', 
        {
          message: inputValue,
          conversationHistory
        }
      );

      // Add bot response
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.data.message 
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "I apologize, but I'm having trouble connecting to my AI services right now. Please try again in a moment."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h2 className="text-2xl font-bold">AI Career Counselor</h2>
        <p className="text-blue-100">Powered by Google's Gemini AI for personalized guidance</p>
      </div>

      {/* Chat Area */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={messageVariants}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={messageVariants}
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about any career path, skills, or education..."
            className="flex-1 p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={isTyping}
          >
            {isTyping ? 'Thinking...' : 'Send'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AICounselor;
