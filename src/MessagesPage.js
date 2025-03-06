import React, { useState } from "react";
import { motion } from "framer-motion";

const MessagesPage = () => {
  // We only need the messages array (no setMessages since it's not used).
  const [messages] = useState([
    {
      id: 1,
      sender: "Mentor John",
      subject: "Upcoming Webinar",
      snippet: "Don't miss our webinar on career opportunities...",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      sender: "System",
      subject: "Profile Updated",
      snippet: "Your profile has been successfully updated.",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      sender: "Peer Alice",
      subject: "Job Opportunity",
      snippet: "Hi, I came across a job posting that might interest you...",
      timestamp: "1 day ago",
    },
  ]);

  return (
    <div className="bg-[#fdf7ee] dark:bg-gray-900 min-h-screen py-10 text-black dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Messages</h1>
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{msg.subject}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {msg.timestamp}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {msg.snippet}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                From: {msg.sender}
              </p>
              <button className="mt-2 text-[#ff7b54] dark:text-[#ff9f86] hover:underline">
                Read More
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
