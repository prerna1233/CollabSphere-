const express = require('express');
const router = express.Router();
const axios = require('axios');

// Replace with your Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
router.post('/', async (req, res) => {
  const { content, action } = req.body;
  if (!content || !action) {
    return res.status(400).json({ message: 'Missing content or action' });
  }
  let prompt = '';
  if (action === 'explain') {
    prompt = `Explain the following note in simple terms:\n\n${content}`;
  } else if (action === 'suggest') {
    prompt = `Suggest improvements for the following note:\n\n${content}`;
  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const geminiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    res.json({ result: geminiText });
  } catch (err) {
    let geminiError = err.message;
    if (err.response && err.response.data) {
      geminiError = JSON.stringify(err.response.data);
    }
    res.status(500).json({ message: 'Gemini API error', error: geminiError });
  }
});

module.exports = router;
// Simple Gemini Q&A endpoint for frontend
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ answer: 'No question provided.' });
  }
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: question }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const geminiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer received.';
    res.json({ answer: geminiText });
  } catch (err) {
    let geminiError = err.message;
    if (err.response && err.response.data) {
      geminiError = JSON.stringify(err.response.data);
    }
    res.status(500).json({ answer: 'Gemini API error', error: geminiError });
  }
});
