import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fdf7ee] min-h-screen w-full dark:bg-gray-900 text-black dark:text-white">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 mt-10">
        {/* Left: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 flex flex-col items-center md:items-start mb-10 md:mb-0"
        >
          <img
            src="/login-illustration.png"
            alt="Registration Illustration"
            className="w-[250px] md:w-[400px] lg:w-[450px]"
          />
        </motion.div>

        {/* Right: Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 bg-[#cbe7fa] rounded-[40px] shadow-lg p-8 flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-[#003049] mb-6">Create Account</h2>

          {/* Display message if any */}
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 w-full max-w-md">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="flex flex-col space-y-4 w-full max-w-md">
              {/* Name Input */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
                required
              />

              {/* Email Input */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
                required
              />

              {/* Password Input */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
                required
              />

              {/* Confirm Password Input */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
                required
              />

              {/* Login Link */}
              <div className="flex justify-end text-sm text-[#003049]">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold hover:underline">
                    Login Here
                  </Link>
                </p>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#003049] text-white rounded-full py-2 px-8 text-lg font-semibold hover:bg-[#00263c] transition-colors mt-2 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Google Sign-Up */}
          <button
            disabled={true}
            className="bg-white flex items-center space-x-2 rounded-full px-6 py-2 text-[#003049] border border-gray-300 hover:bg-gray-100 transition-colors mt-6 opacity-50 cursor-not-allowed"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Sign up with Google (Coming Soon)</span>
          </button>
        </motion.div>
      </div>

      <h1 className="text-[#003049] text-4xl md:text-5xl font-bold mb-6 mt-10 text-center dark:bg-gray-900 text-black dark:text-white">
        Begin Your Journey Today!
      </h1>
    </div>
  );
};

export default RegistrationPage;
