const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const LIST_MODELS_URL = 'https://generativelanguage.googleapis.com/v1/models';

router.get('/', async (req, res) => {
	try {
		const response = await axios.get(
			`${LIST_MODELS_URL}?key=${GEMINI_API_KEY}`,
			{ headers: { 'Content-Type': 'application/json' } }
		);
		res.json(response.data);
	} catch (err) {
		let geminiError = err.message;
		if (err.response && err.response.data) {
			geminiError = JSON.stringify(err.response.data);
		}
		res.status(500).json({ message: 'Gemini API error', error: geminiError });
	}
});

module.exports = router;
