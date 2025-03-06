import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CollegesPage = () => {
  const [searchParams, setSearchParams] = useState({
    percentile: '',
    branch: '',
    category: 'OPEN',
    location: '',
    collegeType: ''
  });

  const [results, setResults] = useState([]);
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = [
    'Computer Engineering',
    'Information Technology',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Production Engineering',
    'Automobile Engineering'
  ];

  const categories = [
    'OPEN',
    'SC',
    'ST',
    'VJ',
    'NT1',
    'NT2',
    'NT3',
    'OBC',
    'EWS',
    'TFWS'
  ];

  const collegeTypes = [
    'All',
    'Government',
    'Private',
    'Aided',
    'Autonomous'
  ];

  // Fetch all colleges when component mounts
  useEffect(() => {
    fetchAllColleges();
  }, []);

  const fetchAllColleges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/colleges');
      setAllColleges(response.data);
    } catch (err) {
      console.error('Error fetching colleges:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/colleges/search', searchParams);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch colleges. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const CollegeCard = ({ college, showEligibility = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-[#003049] mb-2">
              {college.name}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              college.type === 'Government' ? 'bg-blue-100 text-blue-800' :
              college.type === 'Private' ? 'bg-purple-100 text-purple-800' :
              college.type === 'Aided' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {college.type}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{college.location.city}, {college.location.district}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className={`px-2 py-1 rounded-full ${
              college.autonomyStatus === 'Autonomous' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
            }`}>
              {college.autonomyStatus}
            </span>
          </div>
        </div>
        {college.accreditation && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {college.accreditation}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Available Branches
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {college.branches.map((branch) => (
            <div 
              key={branch.branchName} 
              className={`bg-gray-50 p-4 rounded-lg border ${
                showEligibility && searchParams.percentile && 
                parseFloat(searchParams.percentile) >= branch.cutoffs[searchParams.category]
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-[#003049]">{branch.branchName}</p>
                {showEligibility && searchParams.percentile && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    parseFloat(searchParams.percentile) >= branch.cutoffs[searchParams.category]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(searchParams.percentile) >= branch.cutoffs[searchParams.category]
                      ? 'Eligible'
                      : 'Not Eligible'
                    }
                  </span>
                )}
              </div>
              
              {showEligibility ? (
                <>
                  <p className="text-sm text-gray-600 mt-2">
                    Cutoff ({searchParams.category}): {branch.cutoffs[searchParams.category]}
                  </p>
                  {searchParams.percentile && (
                    <p className={`text-sm mt-1 ${
                      parseFloat(searchParams.percentile) >= branch.cutoffs[searchParams.category]
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {parseFloat(searchParams.percentile) >= branch.cutoffs[searchParams.category]
                        ? `You cleared the cutoff by ${(parseFloat(searchParams.percentile) - branch.cutoffs[searchParams.category]).toFixed(2)} points`
                        : `You need ${(branch.cutoffs[searchParams.category] - parseFloat(searchParams.percentile)).toFixed(2)} more points`
                      }
                    </p>
                  )}
                </>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {Object.entries(branch.cutoffs).map(([cat, cutoff]) => (
                    <div key={cat} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{cat}:</span>
                      <span className="font-medium">{cutoff}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {college.branches.length} {college.branches.length === 1 ? 'Branch' : 'Branches'}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {Object.keys(college.branches[0].cutoffs).length} Categories
          </span>
        </div>
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#003049] hover:text-[#00263c] font-medium transition-colors"
          >
            Visit Website
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#fdf7ee] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-[#003049] mb-8 text-center"
        >
          Find Your Dream College
        </motion.h1>

        {/* Search Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSearch} 
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Percentile Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Percentile
              </label>
              <input
                type="number"
                name="percentile"
                value={searchParams.percentile}
                onChange={handleInputChange}
                placeholder="Enter your percentile"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#003049] focus:border-transparent"
                step="0.01"
                min="0"
                max="100"
              />
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Branch
              </label>
              <select
                name="branch"
                value={searchParams.branch}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#003049] focus:border-transparent"
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={searchParams.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#003049] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                name="location"
                value={searchParams.location}
                onChange={handleInputChange}
                placeholder="Enter city or district"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#003049] focus:border-transparent"
              />
            </div>

            {/* College Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Type
              </label>
              <select
                name="collegeType"
                value={searchParams.collegeType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#003049] focus:border-transparent"
              >
                {collegeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-[#003049] text-white px-8 py-3 rounded-full hover:bg-[#00263c] transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Colleges'}
            </motion.button>
          </div>
        </motion.form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-center mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Search Results Section */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 mb-12"
          >
            <h2 className="text-2xl font-semibold text-[#003049] mb-4">
              Search Results ({results.length} colleges found)
            </h2>
            <div className="space-y-6">
              {results.map((college) => (
                <CollegeCard 
                  key={college._id} 
                  college={college}
                  showEligibility={true}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Colleges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-[#003049] mb-4">
            All Colleges ({allColleges.length})
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {allColleges.map((college) => (
              <CollegeCard 
                key={college._id} 
                college={college}
                showEligibility={false}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CollegesPage;
