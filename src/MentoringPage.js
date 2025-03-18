import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaVideo } from 'react-icons/fa';

const MentoringPage = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);

  const mentors = [
    {
      id: 1,
      name: "Dr. Raghuram Rajan",
      role: "Former RBI Governor, Professor at Chicago Booth",
      expertise: "Economics, Finance, Global Markets",
      image: "rajan.jpg",
      availability: "Tuesdays and Thursdays",
      price: "₹5,000/session"
    },
    {
      id: 2,
      name: "Kiran Bedi",
      role: "Former IPS Officer, Social Activist",
      expertise: "Civil Services, Leadership, Social Reform",
      image: "bedi.jpg",
      availability: "Mondays and Wednesdays",
      price: "₹4,500/session"
    },
    {
      id: 3,
      name: "Dr. K. Sivan",
      role: "Former Chairman, ISRO",
      expertise: "Aerospace Engineering, Space Technology",
      image: "sivan.jpg",
      availability: "Fridays and Saturdays",
      price: "₹4,800/session"
    },
    {
      id: 4,
      name: "Sudha Murty",
      role: "Author, Philanthropist, Former Infosys Foundation Chairperson",
      expertise: "Technology, Social Work, Education",
      image: "murty.jpg",
      availability: "Wednesdays and Saturdays",
      price: "₹4,200/session"
    }
  ];

  const bookSession = (mentor) => {
    setSelectedMentor(mentor);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[#003049] dark:text-white mb-8">
          One-on-One Mentoring
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Book personalized sessions with India's leading experts and get guidance for your career journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {mentors.map((mentor) => (
            <motion.div
              key={mentor.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-6">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold text-[#003049] dark:text-white">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {mentor.role}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <FaCalendar />
                    <span>Available: {mentor.availability}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <FaClock />
                    <span>60 minutes per session</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <FaVideo />
                    <span>Video call on Zoom/Google Meet</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-semibold text-[#003049] dark:text-white">
                    {mentor.price}
                  </span>
                  <button
                    onClick={() => bookSession(mentor)}
                    className="bg-[#ff7b54] hover:bg-[#ff6b3d] text-white px-6 py-2 rounded-full font-semibold transition-colors"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Booking Modal */}
      {selectedMentor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-semibold text-[#003049] dark:text-white mb-4">
              Book Session with {selectedMentor.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Select your preferred time slot and date to schedule your mentoring session.
            </p>
            {/* Add your booking form here */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedMentor(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                className="bg-[#ff7b54] hover:bg-[#ff6b3d] text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MentoringPage;
