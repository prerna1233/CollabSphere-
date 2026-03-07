const { Schema, model } = require('mongoose');

const CollabSphereUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = model('collabsphere-users', CollabSphereUserSchema);
