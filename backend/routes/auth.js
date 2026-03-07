const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CollabUser = require('../models/collabsphere-users');
const Project = require('../models/project');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  const alreadyRegistered = await CollabUser.findOne({ email });
  if (alreadyRegistered) return res.status(409).json({ message: 'Email already registered' });

  const encrypted = await bcrypt.hash(password, 12);
  const newUser = new CollabUser({ email, password: encrypted });
  await newUser.save();
  res.status(201).json({ message: 'Account created' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await CollabUser.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No user found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ message: 'Login successful', token });
});

router.post('/logout', async (req, res) => {
  const { email } = req.body;
  console.log('Logout request received for email:', email);
  if (!email) return res.status(400).json({ message: 'Missing email' });
  try {
    const result = await CollabUser.deleteOne({ email });
    console.log('MongoDB delete result:', result);
    res.json({ success: true, message: 'User deleted', result });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Error deleting user.' });
  }
});

// Create project
router.post('/project', async (req, res) => {
  const { name, desc, code, files, notes, members, createdBy } = req.body;
  if (!name || !createdBy) return res.status(400).json({ message: 'Missing required fields' });
  try {
    const project = new Project({ name, desc, code, files, notes, members, createdBy });
    await project.save();
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Get projects for a member
router.get('/projects', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Missing email' });
  try {
    const projects = await Project.find({ members: email });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Update project
router.put('/project/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete project
router.delete('/project/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;
