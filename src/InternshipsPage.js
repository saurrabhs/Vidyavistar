import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulated fetch function - replace with API call
  useEffect(() => {
    // Replace this with an API call to fetch internships data
    const fetchInternships = async () => {
      // Example static data. In production, fetch from your API.
      const data = [
        {
          id: 1,
          title: "Software Development Intern",
          company: "Tech Innovators",
          location: "New York, NY",
          description: "Work on full-stack web development projects.",
        },
        {
          id: 2,
          title: "Marketing Intern",
          company: "Creative Minds",
          location: "San Francisco, CA",
          description: "Assist in social media and digital marketing campaigns.",
        },
        {
          id: 3,
          title: "Data Science Intern",
          company: "Data Pros",
          location: "Remote",
          description: "Analyze datasets and support machine learning projects.",
        },
      ];
      setInternships(data);
    };

    fetchInternships();
  }, []);

  // Filter internships based on search term
  const filteredInternships = internships.filter((internship) =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fdf7ee] dark:bg-gray-900 min-h-screen py-10 text-black dark:text-white transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Internship Opportunities
        </h1>
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search internships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-bold mb-2">{internship.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {internship.company} - {internship.location}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {internship.description}
                </p>
                <button className="text-[#ff7b54] dark:text-[#ff9f86] hover:underline">
                  View Details
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No internships found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;
