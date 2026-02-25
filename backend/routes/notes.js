const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Create a note
router.post('/create', async (req, res) => {
  const { projectId, authorId, content } = req.body;
  if (!projectId || !authorId || !content) return res.status(400).json({ message: 'Missing fields' });
  try {
    const note = new Note({ project: projectId, author: authorId, content });
    await note.save();
    res.json({ note });
  } catch (err) {
    res.status(500).json({ message: 'Error creating note', error: err.message });
  }
});

// Get all notes for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const notes = await Note.find({ project: req.params.projectId }).populate('author', 'name email');
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes', error: err.message });
  }
});

// Update a note
router.put('/update/:noteId', async (req, res) => {
  const { content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(req.params.noteId, { content, updatedAt: Date.now() }, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (err) {
    res.status(500).json({ message: 'Error updating note', error: err.message });
  }
});

// Delete a note
router.delete('/delete/:noteId', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note', error: err.message });
  }
});

module.exports = router;
