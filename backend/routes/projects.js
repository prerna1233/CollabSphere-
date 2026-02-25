const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const User = require('../models/model');

// Create new project
router.post('/create', async (req, res) => {
  const { name, description, creatorId } = req.body;
  if (!name || !creatorId) return res.status(400).json({ message: 'Missing name or creatorId' });
  try {
    const project = new Project({ name, description, creator: creatorId, members: [creatorId] });
    await project.save();
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
});

// Add member to project
router.post('/add-member', async (req, res) => {
  const { projectId, memberEmail } = req.body;
  if (!projectId || !memberEmail) return res.status(400).json({ message: 'Missing projectId or memberEmail' });
  try {
    const user = await User.findOne({ email: memberEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.members.includes(user._id)) project.members.push(user._id);
    await project.save();
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Error adding member', error: err.message });
  }
});

// Get all projects for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const projects = await Project.find({ members: req.params.userId }).populate('members', 'name email');
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
});

module.exports = router;
