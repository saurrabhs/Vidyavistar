import React, { useState } from "react";
import { motion } from "framer-motion";

const scholarships = [
  {
    id: 1,
    name: "National Merit Scholarship",
    provider: "Government of India",
    amount: "₹50,000 per year",
    deadline: "2025-04-30",
    eligibility: "12th grade students with 80% or above marks",
    description: "Merit-based scholarship for high-performing students pursuing higher education.",
    link: "https://scholarships.gov.in/national-merit"
  },
  {
    id: 2,
    name: "Post-Matric Scholarship",
    provider: "Ministry of Social Justice",
    amount: "₹30,000 per year",
    deadline: "2025-05-15",
    eligibility: "SC/ST students pursuing post-matriculation education",
    description: "Financial assistance for SC/ST students to pursue post-matriculation studies.",
    link: "https://scholarships.gov.in/post-matric"
  },
  {
    id: 3,
    name: "Prime Minister's Scholarship Scheme",
    provider: "Government of India",
    amount: "₹75,000 per year",
    deadline: "2025-06-01",
    eligibility: "Children of ex-servicemen/serving personnel",
    description: "Scholarship for the children of ex-servicemen and serving personnel.",
    link: "https://scholarships.gov.in/pmss"
  },
  {
    id: 4,
    name: "AICTE Pragati Scholarship",
    provider: "AICTE",
    amount: "₹50,000 per year",
    deadline: "2025-05-30",
    eligibility: "Female students in technical education",
    description: "Scholarship scheme for girl students in AICTE approved institutions.",
    link: "https://www.aicte-india.org/pragati"
  }
];

const ScholarshipsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "merit") return matchesSearch && scholarship.name.toLowerCase().includes("merit");
    if (filterType === "technical") return matchesSearch && scholarship.description.toLowerCase().includes("technical");
    return matchesSearch;
  });

  return (
    <div className="bg-[#fdf7ee] min-h-screen p-6 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#003049] dark:text-white mb-8">Available Scholarships</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Scholarships</option>
            <option value="merit">Merit Based</option>
            <option value="technical">Technical Education</option>
          </select>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#003049] dark:text-white mb-2">
                  {scholarship.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {scholarship.description}
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="font-medium">Provider:</span>
                    <span className="text-gray-600 dark:text-gray-300">{scholarship.provider}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="text-green-600 dark:text-green-400">{scholarship.amount}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Deadline:</span>
                    <span className="text-red-600 dark:text-red-400">{scholarship.deadline}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <span className="font-medium">Eligibility:</span><br />
                    {scholarship.eligibility}
                  </p>
                </div>
                <a
                  href={scholarship.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center bg-[#ff7b54] text-white py-2 px-4 rounded-md hover:bg-[#ff6b40] transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No scholarships found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
