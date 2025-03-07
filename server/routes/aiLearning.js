const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

// Initialize Google AI with existing Gemini key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Knowledge tracking store (in-memory for now, should be moved to database)
let userKnowledge = new Map();
let learningPaths = new Map();
let userProgress = new Map();

// Helper function to generate knowledge graph
async function generateKnowledgeGraph(subjects, userResponses) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
        const prompt = `Based on these subjects: ${subjects.join(', ')} and user responses: ${JSON.stringify(userResponses)}, 
                   create a detailed knowledge map showing mastery levels (0-100) for each topic. 
                   Format as JSON with subject as key and array of {name, mastery} objects as values.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Knowledge Graph Response:', text);
        return JSON.parse(text);
    } catch (error) {
        console.error('Error generating knowledge graph:', error);
        throw error;
    }
}

// Helper function to generate adaptive learning path
async function generateLearningPath(knowledgeGraph, userPreferences) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
        const prompt = `Based on this knowledge graph: ${JSON.stringify(knowledgeGraph)} 
                   and user preferences: ${JSON.stringify(userPreferences)},
                   create a personalized learning path with steps to improve weak areas.
                   Format as JSON array of {title, description} objects.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Learning Path Response:', text);
        return JSON.parse(text);
    } catch (error) {
        console.error('Error generating learning path:', error);
        throw error;
    }
}

// Get knowledge graph
router.get('/knowledge-graph', auth, async (req, res) => {
    try {
        console.log('Fetching knowledge graph for user:', req.user._id);
        let knowledge = userKnowledge.get(req.user._id);
        
        if (!knowledge) {
            // Default subjects - can be customized based on user's grade/interests
            const defaultSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
            const defaultResponses = {}; // Can be populated from user profile later
            
            console.log('Generating new knowledge graph with subjects:', defaultSubjects);
            knowledge = await generateKnowledgeGraph(defaultSubjects, defaultResponses);
            userKnowledge.set(req.user._id, knowledge);
        }
        
        res.json(knowledge);
    } catch (error) {
        console.error('Error in knowledge-graph route:', error);
        res.status(500).json({ error: 'Failed to generate knowledge graph: ' + error.message });
    }
});

// Get personalized learning path
router.get('/learning-path', auth, async (req, res) => {
    try {
        console.log('Fetching learning path for user:', req.user._id);
        let path = learningPaths.get(req.user._id);
        
        if (!path) {
            const knowledge = userKnowledge.get(req.user._id) || {};
            const userPrefs = { difficulty: 'intermediate' }; // Can be customized
            
            console.log('Generating new learning path');
            path = await generateLearningPath(knowledge, userPrefs);
            learningPaths.set(req.user._id, path);
        }
        
        res.json(path);
    } catch (error) {
        console.error('Error in learning-path route:', error);
        res.status(500).json({ error: 'Failed to generate learning path: ' + error.message });
    }
});

// Solve doubt using Gemini
router.post('/solve-doubt', auth, async (req, res) => {
    try {
        console.log('Solving doubt for user:', req.user._id);
        const { doubt } = req.body;
        
        if (!doubt) {
            return res.status(400).json({ error: 'Doubt question is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `As a knowledgeable tutor, please answer this student doubt: ${doubt}
                       Provide a clear, concise explanation with examples if relevant.`;

        console.log('Sending doubt to Gemini:', doubt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();
        
        console.log('Received answer from Gemini');
        res.json({ answer });
    } catch (error) {
        console.error('Error in solve-doubt route:', error);
        res.status(500).json({ error: 'Failed to solve doubt: ' + error.message });
    }
});

// Get progress and weak areas
router.get('/progress', auth, async (req, res) => {
    try {
        console.log('Fetching progress for user:', req.user._id);
        let progress = userProgress.get(req.user._id);
        
        if (!progress) {
            const knowledge = userKnowledge.get(req.user._id) || {};
            
            // Identify weak areas (topics with mastery < 60%)
            const weakAreas = [];
            for (const [subject, topics] of Object.entries(knowledge)) {
                topics.forEach(topic => {
                    if (topic.mastery < 60) {
                        weakAreas.push({
                            topic: `${subject}: ${topic.name}`,
                            score: topic.mastery
                        });
                    }
                });
            }
            
            progress = { weakAreas };
            userProgress.set(req.user._id, progress);
        }
        
        res.json(progress);
    } catch (error) {
        console.error('Error in progress route:', error);
        res.status(500).json({ error: 'Failed to get progress: ' + error.message });
    }
});

// Get career suggestions
router.get('/career-suggestions', auth, async (req, res) => {
    try {
        console.log('Fetching career suggestions for user:', req.user._id);
        const knowledge = userKnowledge.get(req.user._id) || {};
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Based on this knowledge profile: ${JSON.stringify(knowledge)},
                       suggest suitable career paths. Include required skills for each career.
                       Format as JSON array of {title, description, requiredSkills} objects.`;

        console.log('Generating career suggestions');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestions = JSON.parse(response.text());
        
        res.json(suggestions);
    } catch (error) {
        console.error('Error in career-suggestions route:', error);
        res.status(500).json({ error: 'Failed to get career suggestions: ' + error.message });
    }
});

module.exports = router;
