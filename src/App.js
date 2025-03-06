//i am the developer!!!

import React from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Dashboard from "./Dashboard";
import FAQPage from "./FAQPage";
import RoadmapPage from "./RoadmapPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import MessagesPage from "./MessagesPage";
import InternshipsPage from "./InternshipsPage";

// Updated Navbar that uses AuthContext to conditionally show LOGIN/LOGOUT and change HOME to DASHBOARD when logged in
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // If logged in, show "DASHBOARD" linking to "/dashboard"; otherwise "HOME" linking to "/"
  const menuItems = [
    { name: currentUser ? "DASHBOARD" : "HOME", path: currentUser ? "/dashboard" : "/" },
    { name: "PRO-V", path: "/prov" },
    { name: "ROADMAPS", path: "/roadmaps" },
    { name: "FAQ", path: "/faq" },
    currentUser
      ? {
          name: "LOGOUT",
          action: async () => {
            try {
              await logout();
              navigate("/login");
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        }
      : { name: "LOGIN", path: "/login" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex justify-center py-4" 
      // Removed margin-top and separate background
    >
      <nav
        className="
          bg-[#f2d9c7]
          dark:bg-[#0a0909] text-black dark:text-white
          px-12 py-3
          rounded-full
          shadow-md
          flex items-center gap-12
          border border-gray-300
        "
      >
        {menuItems.map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.08 }}>
            {item.action ? (
              <button
                onClick={item.action}
                className="uppercase font-bold text-2xl text-[#003049] dark:text-white hover:text-[#ff7b54] transition-colors bg-transparent border-none cursor-pointer"
              >
                {item.name}
              </button>
            ) : (
              <Link
                to={item.path}
                className="uppercase font-bold text-2xl text-[#003049] dark:text-white hover:text-[#ff7b54] transition-colors"
              >
                {item.name}
              </Link>
            )}
          </motion.div>
        ))}
      </nav>
    </motion.header>
  );
};

const HeroSection = () => {
  return (
    <main
      className="
        max-w-7xl
        mx-auto
        flex flex-col-reverse md:flex-row
        items-center
        justify-between
        px-8
        mt-10
      "
    >
      {/* Left: Headline & Search */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 mt-10 md:mt-0"
      >
        <h1
          className="
            text-[#003049]
            dark:text-white
            font-extrabold
            text-[60px]
            md:text-7xl
            leading-tight
          "
        >
          Explore!
          <br />
          Dream.
          <br />
          Achieve.
        </h1>
        {/* Search Bar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="
            flex items-center
            border-4
            border-[#003049]
            dark:border-white
            rounded-full
            mt-8
            p-4
            w-full
            md:w-[450px]
            bg-white
            dark:bg-gray-700
            cursor-text
            transition-colors
          "
        >
          <span className="text-3xl text-[#003049] dark:text-white px-3">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="
              border-none
              outline-none
              w-full
              text-2xl
              text-[#003049]
              dark:text-white
              bg-transparent
            "
          />
        </motion.div>
      </motion.div>
      {/* Right: Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 flex justify-center md:justify-end mb-10 md:mb-0"
      >
        <motion.img
          src="homepage.png"
          alt="Hero Illustration"
          className="w-[500px] md:w-[600px] lg:w-[700px]"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </main>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* 
          The main container sets the background for the entire site 
          and toggles to dark mode if the "dark" class is on <html>.
        */}
        <div className="bg-[#fdf7ee] dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 min-h-screen">
          <Navbar />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/prov" element={<div>PRO-V Page Placeholder</div>} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/roadmaps" element={<RoadmapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/internships" element={<InternshipsPage />} />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
