//i am the developer!!!

import React from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

// Import your pages
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Dashboard from './components/Dashboard';
import FAQPage from "./FAQPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import MessagesPage from "./MessagesPage";
import InternshipsPage from "./InternshipsPage";
import GuidancePage from "./GuidancePage";
import CareerPathsPage from "./CareerPathsPage";
import ProVPage from "./ProVPage";
import CollegesPage from "./CollegesPage";
import CollegeSearch from './components/CollegeSearch';
import ScholarshipsPage from './ScholarshipsPage';
import AICounselorPage from "./AICounselorPage";
import AILearningHub from './components/AILearningHub';
import MentoringPage from "./MentoringPage";
import HeroSection from './HeroSection';
import AIChatInterface from './components/AIChatInterface';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

// Updated Navbar that uses AuthContext to conditionally show LOGIN/LOGOUT and change HOME to DASHBOARD when logged in
const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // If logged in, show "DASHBOARD" linking to "/dashboard"; otherwise "HOME" linking to "/"
  const menuItems = [
    { name: currentUser ? "DASHBOARD" : "HOME", path: currentUser ? "/dashboard" : "/" },
    { name: "PRO-V", path: "/prov" },
    { name: "AI COUNSELLING", path: "/ai-counselor" },
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-[#fdf7ee] dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 min-h-screen">
          <Navbar />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HeroSection />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/prov" element={<ProVPage />} />
              <Route path="/ai-counselor" element={<AICounselorPage />} />
              <Route path="/ai-chat" element={<AIChatInterface />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegistrationPage />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-learning" 
                element={
                  <ProtectedRoute>
                    <AILearningHub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment" 
                element={
                  <ProtectedRoute>
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-4">Assessment Coming Soon</h2>
                      <p>Our comprehensive assessment system is under development.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute>
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-4">Educational Resources</h2>
                      <p>Access study materials and guides for various subjects.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/internships" 
                element={
                  <ProtectedRoute>
                    <InternshipsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/guidance" 
                element={
                  <ProtectedRoute>
                    <GuidancePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/career-paths" 
                element={
                  <ProtectedRoute>
                    <CareerPathsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/colleges" 
                element={
                  <ProtectedRoute>
                    <CollegesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/college-search" 
                element={
                  <ProtectedRoute>
                    <CollegeSearch />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/scholarships" 
                element={
                  <ProtectedRoute>
                    <ScholarshipsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mentoring" 
                element={
                  <ProtectedRoute>
                    <MentoringPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
