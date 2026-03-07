const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.post('/explain', async (req, res) => {
  const { code, input } = req.body;
  let text = code || input;
  if (code) {
    text = `Explain this code:\n${code}`;
  } else if (input && input.startsWith('Suggest improvements:')) {
    text = `Suggest improvements for this note:\n${input.replace('Suggest improvements: ', '')}`;
  } else if (input) {
    text = `Explain this note:\n${input}`;
  }
  if (!text) return res.status(400).json({ error: 'Code or input is required.' });
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: text }]
          }
        ]
      })
    });
    const data = await response.json();
    const explanation = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!explanation) {
      console.error('Gemini API response:', JSON.stringify(data, null, 2));
      return res.status(500).json({ error: 'Gemini API did not return an explanation. Check your API key, quota, or input format.' });
    }
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
