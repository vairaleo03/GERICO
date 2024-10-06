// models/Report.js

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  binLocation: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [Number], // [longitude, latitude]
  },
  description: {
    type: String,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

ReportSchema.index({ binLocation: '2dsphere' });

module.exports = mongoose.model('Report', ReportSchema);
