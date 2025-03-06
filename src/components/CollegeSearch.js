import React, { useState } from 'react';
import axios from 'axios';

const CollegeSearch = () => {
  const [searchParams, setSearchParams] = useState({
    percentile: '',
    branch: '',
    category: 'OPEN',
    location: '',
    collegeType: ''
  });

  const [results, setResults] = useState([]);
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

  return (
    <div className="min-h-screen bg-[#fdf7ee] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#003049] mb-8 text-center">
          Find Your Dream College
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
            <button
              type="submit"
              disabled={loading}
              className="bg-[#003049] text-white px-8 py-3 rounded-full hover:bg-[#00263c] transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Colleges'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-center mb-6">
            {error}
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#003049] mb-4">
              Search Results
            </h2>
            {results.map((college) => (
              <div
                key={college._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-[#003049] mb-2">
                      {college.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {college.location.city}, {college.location.district}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {college.type} • {college.autonomyStatus}
                    </p>
                  </div>
                  {college.accreditation && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {college.accreditation}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Available Branches:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {college.branches.map((branch) => (
                      <div key={branch.branchName} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-[#003049]">{branch.branchName}</p>
                        <p className="text-sm text-gray-600">
                          Cutoff ({searchParams.category}): {branch.cutoffs[searchParams.category]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {college.website && (
                  <div className="mt-4 flex justify-end">
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#003049] hover:text-[#00263c] font-medium"
                    >
                      Visit Website →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && results.length === 0 && searchParams.percentile && (
          <div className="text-center text-gray-600">
            No colleges found matching your criteria. Try adjusting your search parameters.
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeSearch;
