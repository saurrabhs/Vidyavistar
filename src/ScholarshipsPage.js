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
    link: "https://scholarships.gov.in/national-merit",
    category: "merit"
  },
  {
    id: 2,
    name: "Post-Matric Scholarship",
    provider: "Ministry of Social Justice",
    amount: "₹30,000 per year",
    deadline: "2025-05-15",
    eligibility: "SC/ST students pursuing post-matriculation education",
    description: "Financial assistance for SC/ST students to pursue post-matriculation studies.",
    link: "https://scholarships.gov.in/post-matric",
    category: "minority"
  },
  {
    id: 3,
    name: "Prime Minister's Scholarship Scheme",
    provider: "Government of India",
    amount: "₹75,000 per year",
    deadline: "2025-06-01",
    eligibility: "Children of ex-servicemen/serving personnel",
    description: "Scholarship for the children of ex-servicemen and serving personnel.",
    link: "https://scholarships.gov.in/pmss",
    category: "special"
  },
  {
    id: 4,
    name: "AICTE Pragati Scholarship",
    provider: "AICTE",
    amount: "₹50,000 per year",
    deadline: "2025-05-30",
    eligibility: "Female students in technical education",
    description: "Scholarship scheme for girl students in AICTE approved institutions.",
    link: "https://www.aicte-india.org/pragati",
    category: "technical"
  },
  {
    id: 5,
    name: "JN Tata Endowment Scholarship",
    provider: "Tata Group",
    amount: "Up to ₹10,00,000",
    deadline: "2025-03-25",
    eligibility: "Indian students pursuing higher education abroad, min. 60% marks",
    description: "Prestigious loan scholarship for Indian students pursuing higher studies abroad.",
    link: "https://www.jntataendowment.org",
    category: "international"
  },
  {
    id: 6,
    name: "KVPY Fellowship",
    provider: "Department of Science and Technology",
    amount: "₹5,000-7,000 monthly",
    deadline: "2025-07-15",
    eligibility: "Students pursuing basic science courses",
    description: "Fellowship program to encourage students in basic sciences research.",
    link: "https://kvpy.iisc.ernet.in",
    category: "research"
  },
  {
    id: 7,
    name: "Google Generation Scholarship",
    provider: "Google",
    amount: "$10,000",
    deadline: "2025-04-15",
    eligibility: "Computer Science/Engineering students",
    description: "For students excelling in computer science and technology studies.",
    link: "https://careers.google.com/students/scholarships",
    category: "technical"
  },
  {
    id: 8,
    name: "Kishore Vaigyanik Protsahan Yojana",
    provider: "Government of India",
    amount: "₹5,000-7,000 monthly",
    deadline: "2025-08-30",
    eligibility: "Science students in 11th, 12th and UG",
    description: "Scholarship to attract talented students towards research careers.",
    link: "https://kvpy.iisc.ac.in",
    category: "research"
  },
  {
    id: 9,
    name: "INSPIRE Scholarship",
    provider: "Department of Science & Technology",
    amount: "₹80,000 per year",
    deadline: "2025-06-30",
    eligibility: "Top 1% in 12th class, pursuing science",
    description: "For students pursuing natural and basic sciences at BSc/Integrated MSc level.",
    link: "https://online-inspire.gov.in",
    category: "merit"
  },
  {
    id: 10,
    name: "Tata Housing Scholarship",
    provider: "Tata Housing",
    amount: "₹50,000 per year",
    deadline: "2025-05-20",
    eligibility: "Architecture students with family income < 6 LPA",
    description: "Supporting underprivileged students in architectural studies.",
    link: "https://www.tatahousing.in/scholarship",
    category: "technical"
  },
  {
    id: 11,
    name: "L'Oréal India For Young Women in Science",
    provider: "L'Oréal India",
    amount: "₹2,50,000 per year",
    deadline: "2025-07-31",
    eligibility: "Female students pursuing science education",
    description: "Encouraging women to pursue careers in scientific research.",
    link: "https://www.loreal.com/india/scholarship",
    category: "research"
  },
  {
    id: 12,
    name: "Keep India Smiling Foundation",
    provider: "Colgate-Palmolive",
    amount: "₹30,000-50,000",
    deadline: "2025-04-30",
    eligibility: "Students from families with income < 5 LPA",
    description: "Supporting education across various streams for underprivileged students.",
    link: "https://www.colgatekeepindiasmiling.in",
    category: "general"
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
    return matchesSearch && scholarship.category === filterType;
  });

  return (
    <div className="bg-[#fdf7ee] min-h-screen p-6 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#003049] dark:text-white mb-4">Available Scholarships</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover scholarships to fund your education journey</p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search scholarships by name, provider, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white min-w-[200px]"
          >
            <option value="all">All Scholarships</option>
            <option value="merit">Merit Based</option>
            <option value="technical">Technical Education</option>
            <option value="research">Research</option>
            <option value="international">International Studies</option>
            <option value="minority">Minority</option>
            <option value="special">Special Category</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-[#003049] dark:text-white">{scholarships.length}</p>
            <p className="text-gray-600 dark:text-gray-400">Total Scholarships</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-600">₹10L+</p>
            <p className="text-gray-600 dark:text-gray-400">Maximum Amount</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-600">8+</p>
            <p className="text-gray-600 dark:text-gray-400">Categories</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-purple-600">5+</p>
            <p className="text-gray-600 dark:text-gray-400">Providers</p>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#003049] dark:text-white">
                    {scholarship.name}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                    {scholarship.category}
                  </span>
                </div>
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
                    <span className="text-green-600 dark:text-green-400 font-semibold">{scholarship.amount}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Deadline:</span>
                    <span className="text-red-600 dark:text-red-400">{scholarship.deadline}</span>
                  </p>
                  <div className="mt-3 pt-3 border-t dark:border-gray-700">
                    <p className="font-medium mb-1">Eligibility:</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {scholarship.eligibility}
                    </p>
                  </div>
                </div>
                <motion.a
                  href={scholarship.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full text-center bg-[#ff7b54] text-white py-2 px-4 rounded-md hover:bg-[#ff6b40] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Now
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <p className="text-xl text-gray-600 dark:text-gray-400">No scholarships found matching your criteria.</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filter settings.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
