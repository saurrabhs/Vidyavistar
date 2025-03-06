import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaDatabase, FaPalette, FaChartLine, FaRobot, FaMobileAlt, FaCloud, FaShieldAlt } from 'react-icons/fa';
import { MdBusinessCenter, MdTrendingUp } from 'react-icons/md';

const CareerPathsPage = () => {
  const [selectedPath, setSelectedPath] = useState(null);

  const careerPaths = [
    {
      id: 1,
      title: 'Web Development',
      icon: <FaCode className="text-4xl" />,
      description: 'Build modern web applications and websites',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database Management'],
      roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
      salary: '$60,000 - $150,000',
      demand: 'High',
      timeline: '6-24 months'
    },
    {
      id: 2,
      title: 'Data Science',
      icon: <FaDatabase className="text-4xl" />,
      description: 'Analyze data and create meaningful insights',
      skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
      roles: ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer'],
      salary: '$70,000 - $160,000',
      demand: 'Very High',
      timeline: '12-36 months'
    },
    {
      id: 3,
      title: 'UI/UX Design',
      icon: <FaPalette className="text-4xl" />,
      description: 'Create beautiful and functional user interfaces',
      skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing'],
      roles: ['UI Designer', 'UX Designer', 'Product Designer'],
      salary: '$55,000 - $130,000',
      demand: 'High',
      timeline: '6-18 months'
    },
    {
      id: 4,
      title: 'Digital Marketing',
      icon: <FaChartLine className="text-4xl" />,
      description: 'Drive growth through digital channels',
      skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics', 'Email Marketing'],
      roles: ['Digital Marketing Manager', 'SEO Specialist', 'Content Strategist'],
      salary: '$45,000 - $120,000',
      demand: 'High',
      timeline: '3-12 months'
    },
    {
      id: 5,
      title: 'AI/ML Engineering',
      icon: <FaRobot className="text-4xl" />,
      description: 'Build intelligent systems and algorithms',
      skills: ['Python', 'Deep Learning', 'TensorFlow', 'Computer Vision', 'NLP'],
      roles: ['ML Engineer', 'AI Researcher', 'Computer Vision Engineer'],
      salary: '$80,000 - $200,000',
      demand: 'Very High',
      timeline: '18-36 months'
    },
    {
      id: 6,
      title: 'Mobile Development',
      icon: <FaMobileAlt className="text-4xl" />,
      description: 'Create mobile applications for iOS and Android',
      skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Mobile UI Design'],
      roles: ['iOS Developer', 'Android Developer', 'Mobile App Developer'],
      salary: '$65,000 - $140,000',
      demand: 'High',
      timeline: '6-24 months'
    },
    {
      id: 7,
      title: 'Cloud Computing',
      icon: <FaCloud className="text-4xl" />,
      description: 'Design and manage cloud infrastructure',
      skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps'],
      roles: ['Cloud Architect', 'DevOps Engineer', 'Site Reliability Engineer'],
      salary: '$75,000 - $180,000',
      demand: 'Very High',
      timeline: '12-30 months'
    },
    {
      id: 8,
      title: 'Cybersecurity',
      icon: <FaShieldAlt className="text-4xl" />,
      description: 'Protect systems and networks from threats',
      skills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Security Tools', 'Risk Management'],
      roles: ['Security Analyst', 'Penetration Tester', 'Security Engineer'],
      salary: '$70,000 - $170,000',
      demand: 'Very High',
      timeline: '12-24 months'
    }
  ];

  const stats = [
    { label: 'Career Paths', value: '8+' },
    { label: 'Active Learners', value: '10K+' },
    { label: 'Success Rate', value: '92%' },
    { label: 'Industry Partners', value: '50+' }
  ];

  return (
    <div className="min-h-screen bg-[#fdf7ee] dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-[#003049] dark:text-white mb-4">
          Explore Career Paths
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover your perfect career path with our comprehensive guides and resources
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
          >
            <div className="text-3xl font-bold text-[#003049] dark:text-white mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Career Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {careerPaths.map((path) => (
          <motion.div
            key={path.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPath(path)}
            className={`
              cursor-pointer p-6 rounded-xl
              ${selectedPath?.id === path.id
                ? 'bg-[#003049] text-white'
                : 'bg-white dark:bg-gray-800'}
              shadow-lg transition-all duration-300
              hover:shadow-xl
              flex flex-col items-center text-center
            `}
          >
            <div className="mb-4">
              {path.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
            <p className="text-sm opacity-90">{path.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Selected Path Details */}
      {selectedPath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="mr-4 text-[#003049] dark:text-white">
                {selectedPath.icon}
              </div>
              <h2 className="text-3xl font-bold text-[#003049] dark:text-white">
                {selectedPath.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-[#003049] dark:text-white">Salary Range</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedPath.salary}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-[#003049] dark:text-white">Market Demand</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedPath.demand}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-[#003049] dark:text-white">Learning Timeline</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedPath.timeline}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-[#003049] dark:text-white">
                  Required Skills
                </h4>
                <ul className="space-y-2">
                  {selectedPath.skills.map((skill, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <MdTrendingUp className="text-[#003049] dark:text-white mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4 text-[#003049] dark:text-white">
                  Career Roles
                </h4>
                <ul className="space-y-2">
                  {selectedPath.roles.map((role, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <MdBusinessCenter className="text-[#003049] dark:text-white mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{role}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CareerPathsPage;
