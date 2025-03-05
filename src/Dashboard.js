import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// Correct icon imports from react-icons/md
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

  // Toggle the right-side notification drawer
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Toggle sidebar between expanded (w-64) and collapsed (w-16)
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="bg-[#fdf7ee] mt-11 min-h-screen w-full relative">
      {/* Header */}
      <header className="bg-[#f8e8d8] px-4 md:px-8 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl  md:text-3xl font-bold text-[#003049]">
                -------- --Vidyavistar Dashboard
            </h1>
          </div>
          {/* Notification Icon */}
          <button
            onClick={toggleNotifications}
            className="text-2xl md:text-3xl text-[#003049] hover:text-[#ff7b54] transition-colors focus:outline-none"
          >
            <MdNotifications />
          </button>
        </div>
      </header>

      {/* Notification Drawer (slides in from the right) */}
      {showNotifications && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl p-6 z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#003049]">Notifications</h2>
            <button
              onClick={toggleNotifications}
              className="text-2xl text-[#003049] focus:outline-none"
            >
              &times;
            </button>
          </div>
          <div className="space-y-4">
            {/* Dummy Notifications */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                Your profile was updated successfully.
              </p>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">New career paths have been added!</p>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                Upcoming internship opportunities available now.
              </p>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Collapsible Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-[#1F2937] text-white z-40 flex flex-col
          transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-[#111827]">
          {!collapsed && (
            <h2 className="text-lg font-bold whitespace-nowrap">Vidyavistar</h2>
          )}
        </div>

        {/* Sidebar Search */}
        <div className="px-4 py-3 bg-[#1F2937] flex items-center">
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
                className="flex items-center p-2 rounded-md hover:bg-[#374151] transition-colors"
              >
                <MdDashboard className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">
                    Dashboard
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className="flex items-center p-2 rounded-md hover:bg-[#374151] transition-colors"
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
                className="flex items-center p-2 rounded-md hover:bg-[#374151] transition-colors"
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
                className="flex items-center p-2 rounded-md hover:bg-[#374151] transition-colors"
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
                className="flex items-center p-2 rounded-md hover:bg-[#374151] transition-colors"
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
                className="flex items-center p-2 rounded-md hover:bg-[#374151] transition-colors"
              >
                <FaBuilding className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">
                    Internships
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center p-2 rounded-md hover:bg-[#374151] transition-colors"
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
        <div className="px-4 py-4 bg-[#111827] flex items-center justify-center">
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-2 text-sm font-semibold bg-[#374151] hover:bg-[#4B5563] px-3 py-2 rounded-md transition-colors"
          >
            <FaChevronLeft
              className={`transform transition-transform ${collapsed ? "rotate-180" : ""}`}
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
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-3xl text-[#003049]" />
              <h2 className="text-2xl font-bold text-[#003049]">Career Paths</h2>
            </div>
            <p className="text-gray-700">
              Explore various career paths tailored to your interests and skills.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaUser className="text-3xl text-[#003049]" />
              <h2 className="text-2xl font-bold text-[#003049]">My Profile</h2>
            </div>
            <p className="text-gray-700">
              Update your profile information and see your progress.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaChalkboardTeacher className="text-3xl text-[#003049]" />
              <h2 className="text-2xl font-bold text-[#003049]">Guidance</h2>
            </div>
            <p className="text-gray-700">
              Access personalized career guidance and mentorship resources.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <FaBuilding className="text-3xl text-[#003049]" />
              <h2 className="text-2xl font-bold text-[#003049]">Internships</h2>
            </div>
            <p className="text-gray-700">
              Discover internship opportunities to kickstart your career.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
