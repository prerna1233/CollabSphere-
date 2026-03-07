const { Schema, model } = require('mongoose');

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String },
  code: { type: String },
  files: [{ name: String, content: String }],
  notes: [String],
  members: [{ type: String, required: true }], // email addresses
  createdBy: { type: String, required: true }, // creator's email
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Project123', ProjectSchema);
