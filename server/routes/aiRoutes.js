const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI with 1.5 model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Career guidance context and prompts
const CAREER_GUIDANCE_CONTEXT = `You are VidyaVistar's AI Career Counselor, an expert in educational and career guidance 
with deep knowledge of various career paths, industry trends, and job market insights. Your goal is to provide 
personalized career guidance to students in India, helping them make informed decisions about their future.

Key Responsibilities:
1. Career Assessment: Analyze students' interests, skills, and academic performance
2. Educational Guidance: Recommend courses, colleges, and specializations
3. Career Path Planning: Suggest potential career paths and required qualifications
4. Industry Insights: Share current trends, job prospects, and growth opportunities
5. Skill Development: Advise on essential skills and certifications
6. Higher Education: Guide about universities, entrance exams, and scholarships

Guidelines:
- Be empathetic and encouraging while maintaining professionalism
- Provide specific, actionable advice based on Indian education system and job market
- Include both traditional and emerging career options
- Consider factors like aptitude, market demand, and future growth
- Suggest practical steps for skill development and preparation
- Share relevant resources and preparation strategies`;

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // Get the Gemini 1.5 model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Start a chat
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });

    // Prepare the prompt with specific guidance
    const prompt = `${CAREER_GUIDANCE_CONTEXT}

Current User Query: ${message}

Please provide guidance that:
1. Directly addresses the user's question
2. Includes specific examples and recommendations
3. Suggests next steps or action items
4. Mentions relevant resources or tools
5. Encourages further exploration and learning

Response:`;

    // Send the message with context
    const result = await chat.sendMessage(prompt);
    const response = await result.response;

    res.json({ response: response.text() });
  } catch (error) {
    console.error('AI Chat Error:', error);
    if (error.message.includes('API key')) {
      res.status(500).json({ error: 'Invalid or missing API key. Please check your configuration.' });
    } else {
      res.status(500).json({ error: 'Failed to process your request. Please try again later.' });
    }
  }
});

module.exports = router;
