import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Ensure firebaseConfig exports auth
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Handle input changes
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;
      // Check if user's email is verified
      if (!user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        return;
      }
      console.log("User logged in:", user.uid);
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Optionally, check for emailVerified if needed
      if (!user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        return;
      }
      console.log("Google login successful:", user.uid);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setMessage(error.message);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    setMessage("");
    if (!loginData.email) {
      setMessage("Please enter your email above to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginData.email);
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage(error.message);
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
            src="login-illustration.png"
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
          {message && <p className="text-red-600 text-center mb-4">{message}</p>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="flex flex-col space-y-4 w-full max-w-md">
              {/* Email Input */}
              <input
                type="email"
                name="email"
                placeholder="email"
                value={loginData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
              />
              {/* Password Input */}
              <input
                type="password"
                name="password"
                placeholder="password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-lg outline-none"
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
                  Don’t have an account?{" "}
                  <Link to="/register" className="font-semibold hover:underline">
                    Register Here
                  </Link>
                </p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="bg-[#003049] text-white rounded-full py-2 px-8 text-lg font-semibold hover:bg-[#00263c] transition-colors mt-2"
              >
                Login
              </button>
            </div>
          </form>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="bg-white flex items-center space-x-2 rounded-full px-6 py-2 text-[#003049] border border-gray-300 hover:bg-gray-100 transition-colors mt-6"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Sign in with Google</span>
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
