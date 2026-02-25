const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const Project = require('../models/project');
const User = require('../models/model');

// Local storage config (for demo; use Cloudinary for production)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware: check if user is project member
async function checkProjectMember(req, res, next) {
  const userId = req.body.uploaderId || req.user?._id;
  const projectId = req.body.projectId || req.params.projectId;
  if (!userId || !projectId) return res.status(400).json({ message: 'Missing user or project' });
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.creator.equals(userId) || project.members.some(m => m.equals(userId))) return next();
  return res.status(403).json({ message: 'Access denied' });
}

// Upload file to a project
router.post('/upload', upload.single('file'), checkProjectMember, async (req, res) => {
  try {
    const { projectId, uploaderId } = req.body;
    const file = new File({
      project: projectId,
      uploader: uploaderId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    });
    await file.save();
    res.json({ file });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
});

// List files for a project
router.get('/project/:projectId', checkProjectMember, async (req, res) => {
  try {
    const files = await File.find({ project: req.params.projectId });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});

// Download/preview a file
router.get('/download/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.sendFile(path.resolve(__dirname, '../uploads', file.filename));
  } catch (err) {
    res.status(500).json({ message: 'Error downloading file', error: err.message });
  }
});

module.exports = router;
