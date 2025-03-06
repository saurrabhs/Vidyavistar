import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Make sure this is your correct auth import
import {
  MdNotifications,
  MdOutlineSearch,
  MdDashboard,
  MdMessage,
  MdSettings,
} from "react-icons/md";
import {
  FaUser,
  FaChalkboardTeacher,
  FaBuilding,
  FaBriefcase,
  FaChevronLeft,
} from "react-icons/fa";

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // We'll store the user photo from auth.currentUser.photoURL here
  const [userPhoto, setUserPhoto] = useState("");

  // On mount, grab the current user's photoURL (if any)
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.photoURL) {
      setUserPhoto(currentUser.photoURL);
    }
  }, []);

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
                src={userPhoto || "/images/default1.png"}
                alt="User Pic"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold whitespace-nowrap">Vidyavistar</h2>
            </div>
          )}
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
                  <span className="ml-4 text-sm font-semibold">
                    Career Paths
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/guidance"
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors"
              >
                <FaChalkboardTeacher className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Guidance</span>
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

        {/* Sidebar Footer / Collapse Button */}
        <div className="px-4 py-4 bg-[#f2d9c7] dark:bg-gray-700 flex items-center justify-center">
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-2 text-sm font-semibold bg-[#f5cbb6] dark:bg-gray-600 hover:bg-[#f2bfa2] dark:hover:bg-gray-500 px-3 py-2 rounded-md transition-colors"
          >
            <FaChevronLeft
              className={`transform transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div
        style={{
          marginLeft: collapsed ? "4rem" : "16rem", // 4rem = w-16, 16rem = w-64
          transition: "margin-left 0.3s ease",
        }}
        className="mt-4 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-3xl text-[#003049] dark:text-white" />
              <h2 className="text-2xl font-bold text-[#003049] dark:text-white">
                Career Paths
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Explore various career paths tailored to your interests and skills.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaUser className="text-3xl text-[#003049] dark:text-white" />
              <h2 className="text-2xl font-bold text-[#003049] dark:text-white">
                My Profile
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Update your profile information and see your progress.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaChalkboardTeacher className="text-3xl text-[#003049] dark:text-white" />
              <h2 className="text-2xl font-bold text-[#003049] dark:text-white">
                Guidance
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Access personalized career guidance and mentorship resources.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaBuilding className="text-3xl text-[#003049] dark:text-white" />
              <h2 className="text-2xl font-bold text-[#003049] dark:text-white">
                Internships
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Discover internship opportunities to kickstart your career.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
