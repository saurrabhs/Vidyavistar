import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

// Remove explicit baseURL and let proxy handle it
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

const AILearningHub = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('knowledge-graph');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [knowledgeData, setKnowledgeData] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [doubt, setDoubt] = useState('');
  const [doubts, setDoubts] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [careerSuggestions, setCareerSuggestions] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setError('Please log in to access the AI Learning Hub');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchUserData();
  }, [currentUser]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [knowledgeRes, pathRes, progressRes, careerRes] = await Promise.all([
        axiosInstance.get('/api/ai/knowledge-graph'),
        axiosInstance.get('/api/ai/learning-path'),
        axiosInstance.get('/api/ai/progress'),
        axiosInstance.get('/api/ai/career-suggestions')
      ]);

      setKnowledgeData(knowledgeRes.data);
      setLearningPath(pathRes.data);
      setWeakAreas(progressRes.data.weakAreas || []);
      setCareerSuggestions(careerRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.error || 'Failed to load user data. Please try again.');
    }
    setLoading(false);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AI Learning Hub</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AI Learning Hub</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button 
                onClick={fetchUserData} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    if (!doubt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/api/ai/solve-doubt', { doubt });
      setDoubts(prev => [...prev, { question: doubt, answer: response.data.answer }]);
      setDoubt('');
    } catch (error) {
      console.error('Error submitting doubt:', error);
      setError(error.response?.data?.error || 'Failed to get answer. Please try again.');
    }
    setLoading(false);
  };

  const renderKnowledgeGraph = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Your Knowledge Map</h3>
      {knowledgeData && (
        <div className="space-y-4">
          {Object.entries(knowledgeData).map(([subject, topics]) => (
            <div key={subject} className="border-b pb-4">
              <h4 className="font-medium text-lg mb-2">{subject}</h4>
              <div className="grid grid-cols-2 gap-4">
                {topics.map(topic => (
                  <div key={topic.name} 
                       className={`p-3 rounded ${
                         topic.mastery > 80 ? 'bg-green-100 dark:bg-green-900' :
                         topic.mastery > 50 ? 'bg-yellow-100 dark:bg-yellow-900' :
                         'bg-red-100 dark:bg-red-900'
                       }`}>
                    <p className="font-medium">{topic.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" 
                           style={{ width: `${topic.mastery}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLearningPath = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Personalized Learning Path</h3>
      {learningPath && (
        <div className="space-y-6">
          {learningPath.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {index + 1}
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                <div className="mt-2">
                  <button className="text-blue-500 hover:underline">Start Learning</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDoubtSolver = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Live Doubt Solver</h3>
      <form onSubmit={handleDoubtSubmit} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            placeholder="Ask your doubt here..."
            className="flex-grow p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ask
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {doubts.map((item, index) => (
          <div key={index} className="border-b pb-4">
            <p className="font-medium text-blue-500">Q: {item.question}</p>
            <p className="mt-2">A: {item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgressTracker = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Progress Tracker</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Areas Needing Improvement</h4>
          {weakAreas.map((area, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <span>{area.topic}</span>
                <span>{area.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${area.score}%` }}
                ></div>
              </div>
              <div className="mt-2">
                <button className="text-sm text-blue-500 hover:underline">
                  View Recommended Exercises
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCareerSuggestions = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Career Pathway Suggestions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careerSuggestions.map((career, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h4 className="font-medium text-lg">{career.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{career.description}</p>
            <div className="space-y-2">
              <p><strong>Required Skills:</strong></p>
              <ul className="list-disc list-inside">
                {career.requiredSkills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
            <button className="mt-4 text-blue-500 hover:underline">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {[
          { id: 'knowledge-graph', label: 'Knowledge Graph' },
          { id: 'learning-path', label: 'Learning Path' },
          { id: 'doubt-solver', label: 'Doubt Solver' },
          { id: 'progress', label: 'Progress Tracker' },
          { id: 'career', label: 'Career Suggestions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'knowledge-graph' && renderKnowledgeGraph()}
        {activeTab === 'learning-path' && renderLearningPath()}
        {activeTab === 'doubt-solver' && renderDoubtSolver()}
        {activeTab === 'progress' && renderProgressTracker()}
        {activeTab === 'career' && renderCareerSuggestions()}
      </div>
    </div>
  );
};

export default AILearningHub;
