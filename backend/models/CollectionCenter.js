// models/CollectionCenter.js

const mongoose = require('mongoose');

const CollectionCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Assicurati che ogni centro sia unico
  },
  address: {
    type: String,
    required: true,
  },
  wasteTypes: {
    type: [String],
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Creazione dell'indice geospaziale
CollectionCenterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CollectionCenter', CollectionCenterSchema);
