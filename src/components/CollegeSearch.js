import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import sampleColleges from '../data/sampleColleges';

const CollegeSearch = () => {
  const [searchParams, setSearchParams] = useState({
    percentile: '',
    branch: '',
    category: 'OPEN',
    location: '',
    collegeType: 'All'
  });

  const [cities, setCities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch cities and branches on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try primary server first, fallback to alternate port if needed
        let citiesRes, branchesRes;
        try {
          [citiesRes, branchesRes] = await Promise.all([
            axios.get('http://localhost:5000/api/colleges/cities'),
            axios.get('http://localhost:5000/api/colleges/branches')
          ]);
        } catch (e) {
          // backend might be on 5002 or unavailable — derive from sample
          const cities = Array.from(new Set(sampleColleges.map(c => c.location?.city).filter(Boolean)));
          const branches = Array.from(new Set(sampleColleges.flatMap(c => c.branches?.map(b => b.branchName) || [])));
          setCities(cities.sort());
          setBranches(branches.sort());
          return;
        }

        // Filter out empty or invalid cities and sort them
        const validCities = citiesRes.data
          .filter(city => city && typeof city === 'string')
          .sort((a, b) => a.localeCompare(b));
        setCities(validCities);

        // Filter out empty or invalid branches and sort them
        const validBranches = branchesRes.data
          .filter(branch => branch && typeof branch === 'string')
          .sort((a, b) => a.localeCompare(b));
        setBranches(validBranches);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // use sample data fallback
        const cities = Array.from(new Set(sampleColleges.map(c => c.location?.city).filter(Boolean)));
        const branches = Array.from(new Set(sampleColleges.flatMap(c => c.branches?.map(b => b.branchName) || [])));
        setCities(cities.sort());
        setBranches(branches.sort());
        setError('Failed to load cities and branches from backend — using sample data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  // Memoized search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (params) => {
        if (!params.percentile && !params.branch && !params.location && !params.collegeType) {
          setResults([]);
          return;
        }

        setLoading(true);
        setError('');
        try {
            // Try backend search, fallback to sample data filtering
            let response;
            try {
              response = await axios.post('http://localhost:5000/api/colleges/search', params);
              setResults(response.data.results || response.data);
            } catch (e) {
              // Filter sampleColleges locally
              let filtered = sampleColleges;
              if (params.location) {
                filtered = filtered.filter(c => c.location?.city?.toLowerCase() === params.location.toLowerCase());
              }
              if (params.collegeType && params.collegeType !== 'All') {
                filtered = filtered.filter(c => c.type === params.collegeType);
              }
              if (params.branch) {
                filtered = filtered.filter(c => c.branches?.some(b => b.branchName === params.branch));
              }
              if (params.percentile && params.category) {
                filtered = filtered.filter(c => c.branches?.some(b => (parseFloat(b.cutoffs?.[params.category]) || 0) <= parseFloat(params.percentile)));
              }
              setResults(filtered);
            }
        } catch (err) {
          setError('Failed to fetch colleges. Please try again.');
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  // Clean up debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setSearchParams(prev => {
      const newParams = {
        ...prev,
        [name]: value
      };
      debouncedSearch(newParams);
      return newParams;
    });
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-[#fdf7ee] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#003049] mb-8 text-center">
          Find Your Dream College
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search Form */}
        <form className="bg-white rounded-lg shadow-lg p-6 mb-8" onSubmit={e => e.preventDefault()}>
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
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
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
                {collegeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003049]"></div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.map(college => (
            <div key={college._id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#003049] mb-2">{college.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <p><span className="font-medium">Location:</span> {college.location?.city}</p>
                  <p><span className="font-medium">Type:</span> {college.type}</p>
                </div>
                <div>
                  <p><span className="font-medium">Available Branches:</span></p>
                  <ul className="list-disc list-inside">
                    {college.branches?.map(branch => (
                      <li key={branch.branchName}>
                        {branch.branchName} 
                        {branch.cutoffs?.[searchParams.category] && 
                          ` (Cutoff: ${branch.cutoffs[searchParams.category]})`
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {!loading && results.length === 0 && searchParams.percentile && (
          <div className="text-center py-8 text-gray-600">
            No colleges found matching your criteria. Try adjusting your search parameters.
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeSearch;
