import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaLightbulb, FaChalkboardTeacher, FaBook, FaQuestionCircle } from 'react-icons/fa';
import { MdWork, MdTrendingUp } from 'react-icons/md';

const GuidancePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      title: 'Academic Guidance',
      icon: <FaGraduationCap className="text-4xl" />,
      description: 'Get help with your studies and academic planning',
      content: [
        'Course selection advice',
        'Study techniques and strategies',
        'Academic goal setting',
        'Time management tips',
        'Exam preparation guidance'
      ]
    },
    {
      id: 2,
      title: 'Career Counseling',
      icon: <MdWork className="text-4xl" />,
      description: 'Explore career paths and opportunities',
      content: [
        'Career path exploration',
        'Industry insights',
        'Resume building tips',
        'Interview preparation',
        'Job search strategies'
      ]
    },
    {
      id: 3,
      title: 'Skill Development',
      icon: <MdTrendingUp className="text-4xl" />,
      description: 'Enhance your skills and capabilities',
      content: [
        'Technical skills training',
        'Soft skills development',
        'Leadership training',
        'Communication skills',
        'Problem-solving techniques'
      ]
    },
    {
      id: 4,
      title: 'Mentorship',
      icon: <FaChalkboardTeacher className="text-4xl" />,
      description: 'Connect with experienced mentors',
      content: [
        'One-on-one mentoring',
        'Industry expert sessions',
        'Peer mentoring opportunities',
        'Group mentoring programs',
        'Mentor matching service'
      ]
    }
  ];

  const resources = [
    {
      title: 'E-Learning Resources',
      icon: <FaBook />,
      description: 'Access our curated collection of online learning materials'
    },
    {
      title: 'Career Assessment',
      icon: <FaLightbulb />,
      description: 'Take our career assessment test to discover your potential'
    },
    {
      title: 'FAQ & Support',
      icon: <FaQuestionCircle />,
      description: 'Find answers to common questions and get support'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdf7ee] dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-[#003049] dark:text-white mb-4">
          Student Guidance Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get personalized guidance and support for your academic and professional journey
        </p>
      </motion.div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(category)}
            className={`
              cursor-pointer p-6 rounded-xl
              ${selectedCategory?.id === category.id
                ? 'bg-[#003049] text-white'
                : 'bg-white dark:bg-gray-800'}
              shadow-lg transition-all duration-300
              hover:shadow-xl
              flex flex-col items-center text-center
            `}
          >
            <div className="mb-4">
              {category.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-sm opacity-90">{category.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Selected Category Content */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold text-[#003049] dark:text-white mb-6">
            {selectedCategory.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory.content.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <p className="text-gray-800 dark:text-gray-200">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="text-[#003049] dark:text-white text-2xl mb-4">
              {resource.icon}
            </div>
            <h3 className="text-xl font-semibold text-[#003049] dark:text-white mb-2">
              {resource.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {resource.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GuidancePage;
