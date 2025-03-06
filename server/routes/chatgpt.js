const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System message to guide Gemini's behavior
const SYSTEM_MESSAGE = `You are an expert career counselor with deep knowledge of various professional fields, 
educational pathways, and industry trends. Your goal is to provide personalized career guidance to students 
and professionals. Consider their interests, skills, educational background, and market demands when giving advice. 
Be supportive, informative, and practical in your recommendations. Include specific steps, required skills, 
and educational paths when discussing career options.`;

// Protected route - only authenticated users can access
router.post('/chat', async (req, res) => {  // Temporarily removed auth middleware for testing
  try {
    const { message } = req.body;

    // Get the chat model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Send message and get response
    const result = await model.generateContent([
      SYSTEM_MESSAGE,
      message
    ]);
    const response = await result.response;
    const text = response.text();

    res.json({
      message: text,
      role: 'assistant'
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message 
    });
  }
});

module.exports = router;
