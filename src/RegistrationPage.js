import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// Import Firebase configuration, auth, and Firestore services
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegistrationPage = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission using Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date(),
      });

      console.log("User registered successfully:", user.uid);
      // Set message to instruct the user to verify their email
      setMessage(
        "A verification link has been sent to your email. Please verify your email to login."
      );
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-[#fdf7ee] mt-20 flex justify-center items-center">
      {/* Registration Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="
          bg-[#cbe7fa]
          w-[90%]
          md:w-[80%]
          lg:w-[70%]
          rounded-[40px]
          shadow-lg
          p-8
          flex flex-col
          items-center
          space-y-8
        "
      >
        <h1 className="text-[#003049] text-3xl md:text-4xl font-bold">
          Registration
        </h1>
        {/* Display message if any */}
        {message && (
          <p className="text-center text-red-600 px-4">{message}</p>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-6">
          {/* Row 1: First Name & Last Name */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="
                flex-1
                border
                border-gray-300
                rounded-full
                py-2 px-4
                text-lg
                outline-none
                bg-white
              "
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="
                flex-1
                border
                border-gray-300
                rounded-full
                py-2 px-4
                text-lg
                outline-none
                bg-white
              "
            />
          </div>

          {/* Row 2: Email & Password */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full">
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              className="
                flex-1
                border
                border-gray-300
                rounded-full
                py-2 px-4
                text-lg
                outline-none
                bg-white
              "
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              className="
                flex-1
                border
                border-gray-300
                rounded-full
                py-2 px-4
                text-lg
                outline-none
                bg-white
              "
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
              bg-[#003049]
              text-white
              rounded-full
              py-2
              px-8
              text-lg
              font-semibold
              hover:bg-[#00263c]
              transition-colors
              mx-auto
              block
            "
          >
            REGISTER
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-center text-[#003049]">
          Have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
