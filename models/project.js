const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Project', projectSchema);


