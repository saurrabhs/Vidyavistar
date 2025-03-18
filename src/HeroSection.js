import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <main className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-8 mt-10">
      {/* Left: Headline & Search */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 mt-10 md:mt-0"
      >
        <h1 className="text-[#003049] dark:text-white font-extrabold text-[60px] md:text-7xl leading-tight">
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
          className="flex items-center border-4 border-[#003049] dark:border-white rounded-full mt-8 p-4 w-full md:w-[450px] bg-white dark:bg-gray-700 cursor-text transition-colors"
        >
          <span className="text-3xl text-[#003049] dark:text-white px-3">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="border-none outline-none w-full text-2xl text-[#003049] dark:text-white bg-transparent"
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

export default HeroSection;
