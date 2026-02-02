import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  MdOutlineSearch,
  MdDashboard,
  MdMessage,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import {
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaChevronLeft,
  FaCompass,
  FaUniversity,
  FaGraduationCap,
  FaBrain,
  FaChartLine,
  FaRobot,
  FaBook,
} from "react-icons/fa";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-[#fdf7ee] min-h-screen w-full relative dark:bg-gray-900 text-black dark:text-white">
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
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <img
                src={currentUser?.profilePicture || "/images/default1.png"}
                alt="User Pic"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold whitespace-nowrap">
                {currentUser?.name || "User"}
              </h2>
            </div>
          )}
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
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center p-2 rounded-md hover:bg-[#f2d9c7] dark:hover:bg-gray-700 transition-colors w-full text-left"
              >
                <MdLogout className="text-xl" />
                {!collapsed && (
                  <span className="ml-4 text-sm font-semibold">Logout</span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`p-8 ${
          collapsed ? "ml-16" : "ml-64"
        } mt-11 transition-all duration-300`}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#003049] mb-4">Vidyavistar Dashboard</h1>
          <p className="text-xl text-gray-700">Welcome back, saurabh! 👋</p>
        </div>

        {/* NEP Section */}
        <div className="bg-blue-50 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold mb-4">NEP 2024-25: Transforming Indian Education</h2>
          <p className="text-gray-700 mb-6">
            The New Education Policy 2024-25 introduces groundbreaking reforms to make Indian education more flexible, inclusive, and comprehensive. 
            The traditional 10+2 structure has been transformed into a dynamic 5+3+3+4 system, aligning education with developmental stages.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Key Features:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Multiple attempts for board exams</li>
                <li>Multidisciplinary learning approach</li>
                <li>Early childhood education focus</li>
                <li>Integrated vocational training</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">New Structure:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Foundational (Age 3-8)</li>
                <li>Preparatory (Age 8-11)</li>
                <li>Middle (Age 11-14)</li>
                <li>Secondary (Age 14-18)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* AI Learning Hub */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaBrain className="text-4xl text-blue-500" />
              <h3 className="text-xl font-semibold ml-3">AI Learning Hub</h3>
            </div>
            <p className="text-gray-600 mb-4">Experience personalized learning with our advanced AI system.</p>
            <Link 
              to="/ai-learning-hub"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Get Started →
            </Link>
          </div>

          {/* Career Assessment */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-4xl text-green-500" />
              <h3 className="text-xl font-semibold ml-3">Career Assessment</h3>
            </div>
            <p className="text-gray-600 mb-4">Discover your ideal career path through comprehensive assessment.</p>
            <Link 
              to="/career-assessment"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Get Started →
            </Link>
          </div>

          {/* AI Counselor */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaRobot className="text-4xl text-purple-500" />
              <h3 className="text-xl font-semibold ml-3">AI Counselor</h3>
            </div>
            <p className="text-gray-600 mb-4">Get personalized guidance from our AI-powered counseling system.</p>
            <Link 
              to="/ai-counselor"
              className="inline-block bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Get Started →
            </Link>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FaBook className="text-4xl text-red-500" />
              <h3 className="text-xl font-semibold ml-3">Resources</h3>
            </div>
            <p className="text-gray-600 mb-4">Access study materials and guides for various subjects.</p>
            <Link 
              to="/resources"
              className="inline-block bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
