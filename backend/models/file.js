const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
  originalName: { type: String, required: true },
  filename: { type: String, required: true }, // stored filename
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String }, // for Cloudinary or remote storage
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
