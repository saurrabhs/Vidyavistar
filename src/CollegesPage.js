import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import sampleColleges from './data/sampleColleges';

const CollegesPage = () => {
  const [searchParams, setSearchParams] = useState({
    percentile: '',
    branch: '',
    category: 'OPEN',
    location: '',
    collegeType: '',
    page: 1,
    limit: 10
  });

  const [results, setResults] = useState({ results: [], totalPages: 1, currentPage: 1, totalResults: 0 });
  const [allColleges, setAllColleges] = useState({ results: [], totalPages: 1, currentPage: 1, totalResults: 0 });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const locations = [
    'Mumbai',
    'Pune',
    'Nagpur',
    'Nashik',
    'Aurangabad',
    'Amravati',
    'Solapur',
    'Kolhapur',
    'Satara',
    'Thane',
    'Navi Mumbai'
  ];

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

  useEffect(() => {
    fetchAllColleges();
  }, []);

  const fetchAllColleges = async () => {
    setInitialLoading(true);
    setError('');
    try {
      // try primary backend (5001), then fallback to default server (5002)
      let response;
      try {
        response = await axios.get('http://localhost:5001/api/colleges', { params: { page: 1, limit: 10 } });
      } catch (e) {
        // fallback to server port 5002
        response = await axios.get('http://localhost:5002/api/colleges', { params: { page: 1, limit: 10 } });
      }

      if (response?.data && response.data.results && response.data.results.length > 0) {
        setAllColleges(response.data);
      } else {
        // If backend returned empty or unexpected structure, use sample data
        setAllColleges({ results: sampleColleges.slice(0, 10), totalPages: 1, currentPage: 1, totalResults: sampleColleges.length });
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
      // Use local sample data as a graceful fallback when backend is unavailable
      setAllColleges({ results: sampleColleges.slice(0, 10), totalPages: 1, currentPage: 1, totalResults: sampleColleges.length });
      setError('Backend unavailable — showing sample colleges.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset page when changing filters
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      try {
        response = await axios.post('http://localhost:5001/api/colleges/search', searchParams);
      } catch (e) {
        response = await axios.post('http://localhost:5002/api/colleges/search', searchParams);
      }

      if (response?.data) {
        setResults(response.data);
      } else {
        // fallback to local sample filtering
        const filtered = sampleColleges.filter(c => {
          if (searchParams.location && searchParams.location !== '' && c.location?.city.toLowerCase() !== searchParams.location.toLowerCase()) return false;
          if (searchParams.collegeType && searchParams.collegeType !== '' && searchParams.collegeType !== 'All' && c.type !== searchParams.collegeType) return false;
          if (searchParams.branch && searchParams.branch !== '' && !c.branches?.some(b => b.branchName === searchParams.branch)) return false;
          if (searchParams.percentile && searchParams.category) {
            const isEligible = c.branches?.some(b => (parseFloat(b.cutoffs?.[searchParams.category]) || 0) <= parseFloat(searchParams.percentile));
            if (!isEligible) return false;
          }
          return true;
        });
        setResults({ results: filtered, totalPages: 1, currentPage: 1, totalResults: filtered.length });
      }
    } catch (err) {
      setError('Failed to fetch colleges. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
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
          {college.branches.map((branch) => {
            const isEligible = showEligibility && 
              searchParams.percentile && 
              parseFloat(searchParams.percentile) >= branch.cutoffs[searchParams.category];
            
            return (
              <div 
                key={branch.branchName} 
                className={`p-4 rounded-lg border ${
                  showEligibility && searchParams.percentile
                    ? isEligible
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-[#003049]">{branch.branchName}</p>
                  {showEligibility && searchParams.percentile && (
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      isEligible
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {isEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Cutoff: {branch.cutoffs[searchParams.category]}%
                </div>
              </div>
            );
          })}
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

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
              </label>
              <select
                name="location"
                value={searchParams.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#003049] focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
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
                <option value="">All Types</option>
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
        {results.results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 mb-12"
          >
            <h2 className="text-2xl font-semibold text-[#003049] mb-4">
              Search Results ({results.totalResults} colleges found)
            </h2>
            <div className="space-y-6">
              {results.results.map((college) => (
                <CollegeCard
                  key={college._id}
                  college={college}
                  showEligibility={true}
                />
              ))}
            </div>
            
            {/* Pagination for Search Results */}
            {results.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: results.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded ${
                      page === results.currentPage
                        ? 'bg-[#003049] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
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
            All Colleges {!initialLoading && `(${allColleges.totalResults})`}
          </h2>
          
          {initialLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#003049] border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading colleges...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {allColleges.results.map((college) => (
                  <CollegeCard 
                    key={college._id} 
                    college={college}
                    showEligibility={false}
                  />
                ))}
              </div>
              
              {/* Pagination for All Colleges */}
              {allColleges.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: allColleges.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setAllColleges(prev => ({ ...prev, currentPage: page }));
                        fetchAllColleges();
                      }}
                      className={`px-4 py-2 rounded ${
                        page === allColleges.currentPage
                          ? 'bg-[#003049] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CollegesPage;
