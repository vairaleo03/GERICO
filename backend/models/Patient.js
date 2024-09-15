// models/Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  medicalHistory: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', PatientSchema);