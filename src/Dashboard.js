import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import {
  MdNotifications,
  MdOutlineSearch,
  MdDashboard,
  MdMessage,
  MdSettings,
} from "react-icons/md";
import {
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaChevronLeft,
  FaCompass,
  FaUniversity,
  FaGraduationCap,
} from "react-icons/fa";

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // Toggle the right-side notification drawer
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Toggle sidebar between expanded (w-64) and collapsed (w-16)
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="bg-[#fdf7ee] mt-11 min-h-screen w-full relative dark:bg-gray-900 text-black dark:text-white">
      
      {/* Header */}
      <header className="bg-[#f2d9c7] px-4 md:px-8 py-4 shadow-md relative">
        {/* Centered Title */}
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#003049] dark:text-black">
            Vidyavistar Dashboard
          </h1>
        </div>
        {/* Notification Bell in top-right corner */}
        <button
          onClick={toggleNotifications}
          className="absolute right-4 top-4 text-2xl md:text-3xl text-[#003049] dark:text-white hover:text-[#ff7b54] transition-colors focus:outline-none"
        >
          <MdNotifications />
        </button>
      </header>

      {/* Notification Drawer (slides in from the right) */}
      {showNotifications && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl p-6 z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#003049] dark:text-white">
              Notifications
            </h2>
            <button
              onClick={toggleNotifications}
              className="text-2xl text-[#003049] dark:text-white focus:outline-none"
            >
              &times;
            </button>
          </div>
          <div className="space-y-4">
            {/* Dummy Notifications */}
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Your profile was updated successfully.
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                2 hours ago
              </span>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                New career paths have been added!
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                5 hours ago
              </span>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Upcoming internship opportunities available now.
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                1 day ago
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Collapsible Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full
          bg-[#f8e8d8] dark:bg-gray-800
          text-black dark:text-white
          z-40 flex flex-col
          transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-[#f2d9c7] dark:bg-gray-700">
          {/* If not collapsed, show the site name and user pic */}
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <img
                src={currentUser?.profilePicture ? `http://localhost:4000${currentUser.profilePicture}` : "/images/default1.png"}
                alt="User Pic"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold whitespace-nowrap">
                {currentUser?.name || "User"}
              </h2>
            </div>
          )}
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-[#e5c3a8] rounded-full focus:outline-none"
          >
            <FaChevronLeft
              className={`transform transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Sidebar Search */}
        <div className="px-4 py-3 bg-[#f8e8d8] dark:bg-gray-800 flex items-center">
          <MdOutlineSearch className="text-xl" />
          {!collapsed && (
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 w-full bg-transparent outline-none text-sm"
            />
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <MdDashboard className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Dashboard</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <MdMessage className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Messages</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <FaUser className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Profile</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/career-paths"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <FaBriefcase className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Career Paths</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/scholarships"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <FaGraduationCap className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Scholarships</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/colleges"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <FaUniversity className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Colleges</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/internships"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <FaBuilding className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Internships</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/guidance"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <FaCompass className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Guidance</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <MdSettings className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Settings</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Dashboard Content */}
      <div
        style={{
          marginLeft: collapsed ? "4rem" : "16rem", // 4rem = w-16, 16rem = w-64
          transition: "margin-left 0.3s ease",
        }}
        className="mt-4 p-4"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#003049] mb-2">Welcome back, {currentUser?.name || "saurabh"}! 👋</h2>
        </div>

        {/* NEP 2024-25 Section */}
        <div className="bg-[#f0f7ff] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#003049] mb-4">NEP 2024-25: Transforming Indian Education</h2>
          
          <p className="text-gray-700 mb-6">
            The New Education Policy 2024-25 introduces groundbreaking reforms to make Indian education more flexible, inclusive, and comprehensive. 
            The traditional 10+2 structure has been transformed into a dynamic 5+3+3+4 system, aligning education with developmental stages.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#003049] mb-3">Key Features:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Multiple attempts for board exams
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Multidisciplinary learning approach
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Early childhood education focus
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Integrated vocational training
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#003049] mb-3">New Structure:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Foundational (Age 3-8)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Preparatory (Age 8-11)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Middle (Age 11-14)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Secondary (Age 14-18)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
