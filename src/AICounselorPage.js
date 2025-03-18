import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const AICounselorPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const features = [
    {
      title: "Knowledge Graph",
      description: "Visual mapping of your knowledge and learning needs",
      icon: "📊"
    },
    {
      title: "Adaptive Learning",
      description: "Personalized learning paths based on your performance",
      icon: "🎯"
    },
    {
      title: "Live Doubt Solver",
      description: "Real-time doubt resolution using Google's Generative AI",
      icon: "💡"
    },
    {
      title: "Progress Tracker",
      description: "Track your progress and identify weak areas",
      icon: "📈"
    },
    {
      title: "Career Guidance",
      description: "AI-powered career suggestions and skill mapping",
      icon: "🎓"
    }
  ];

  const handleGetStarted = () => {
    navigate('/ai-chat');
  };

  return (
    <div className="min-h-screen bg-[#fdf7ee] dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#003049] dark:text-white mb-6">
              AI-Powered Learning Assistant
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience personalized learning with our advanced AI system. Get instant help, track your progress, and achieve your educational goals.
            </p>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#003049] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#00263c] transition-colors inline-block"
            >
              Get Started
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <img
              src="/ai-counselor.png"
              alt="AI Counselor"
              className="w-full max-w-lg mx-auto"
            />
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={handleGetStarted}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#003049] dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Try AI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-[#cbe7fa] dark:bg-gray-800 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-[#003049] dark:text-white mb-6">
            Experience AI Learning
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Start chatting with our AI counselor now to get personalized career guidance.
          </p>
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#003049] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#00263c] transition-colors inline-block"
          >
            Chat with AI Counselor
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AICounselorPage;
