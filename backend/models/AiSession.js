// models/AiSession.js
const mongoose = require('mongoose');

const AiSessionSchema = new mongoose.Schema(
  {
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    inputData: { type: String, required: true },
    aiResponse: { type: String, required: true },
  },
  { timestamps: true } // Abilita i timestamp automatici
);

module.exports = mongoose.model('AiSession', AiSessionSchema);
