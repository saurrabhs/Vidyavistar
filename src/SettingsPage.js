import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [message, setMessage] = useState("");

  // Check localStorage for theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleEmailNotificationsToggle = () => setEmailNotifications(!emailNotifications);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleSaveSettings = () => {
    setMessage("Settings saved successfully!");
  };

  return (
    <div className="bg-[#fdf7ee] dark:bg-gray-800 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg transition-colors duration-300">
        <h1 className="text-3xl font-bold text-[#003049] dark:text-gray-100 text-center mb-6">
          Settings
        </h1>
        {message && (
          <p className="text-center text-green-600 dark:text-green-400 mb-4">
            {message}
          </p>
        )}
        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xl text-[#003049] dark:text-gray-100 font-medium">
              Dark Mode
            </span>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                darkMode ? "bg-[#003049]" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  darkMode ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xl text-[#003049] dark:text-gray-100 font-medium">
              Email Notifications
            </span>
            <button
              onClick={handleEmailNotificationsToggle}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                emailNotifications ? "bg-[#003049]" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  emailNotifications ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          {/* Language Selection */}
          <div className="flex flex-col">
            <label className="text-xl text-[#003049] dark:text-gray-100 font-medium mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full border border-gray-300 p-2 rounded dark:bg-gray-600 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-8 w-full bg-[#003049] text-white py-2 rounded-full font-semibold transition-colors hover:bg-[#00263c]"
          onClick={handleSaveSettings}
        >
          Save Settings
        </motion.button>
      </div>
    </div>
  );
};

export default SettingsPage;
