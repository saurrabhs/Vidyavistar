import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useContext(AuthContext);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setMessage(""); // Clear any error messages when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await login({
        email: loginData.email,
        password: loginData.password
      });
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || 
        authError || 
        "Failed to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setMessage("");
    if (!loginData.email) {
      setMessage("Please enter your email above to reset your password.");
      return;
    }
    setMessage("Password reset functionality will be implemented soon.");
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
            alt="Login Illustration"
            className="w-[250px] md:w-[400px] lg:w-[450px]"
          />
        </motion.div>

        {/* Right: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 bg-[#cbe7fa] rounded-[40px] shadow-lg p-8 flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-[#003049] mb-6">Login</h2>

          {/* Display message if any */}
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 w-full max-w-md">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="flex flex-col space-y-4 w-full max-w-md">
              {/* Email Input */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
                required
              />
              {/* Password Input */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
                required
              />

              {/* Forgot Password & Register Links */}
              <div className="flex justify-between text-sm text-[#003049]">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="font-semibold hover:underline">
                    Register Here
                  </Link>
                </p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#003049] text-white rounded-full py-2 px-8 text-lg font-semibold hover:bg-[#00263c] transition-colors mt-2 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>
          </form>

          {/* Google Sign-In */}
          <button
            disabled={true}
            className="bg-white flex items-center space-x-2 rounded-full px-6 py-2 text-[#003049] border border-gray-300 hover:bg-gray-100 transition-colors mt-6 opacity-50 cursor-not-allowed"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Sign in with Google (Coming Soon)</span>
          </button>
        </motion.div>
      </div>

      <h1 className="text-[#003049] text-4xl md:text-5xl font-bold mb-6 mt-10 text-center dark:bg-gray-900 text-black dark:text-white">
        Step Toward Your Future!
      </h1>
    </div>
  );
};

export default LoginPage;
