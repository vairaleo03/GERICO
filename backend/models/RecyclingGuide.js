// models/RecyclingGuide.js

const mongoose = require('mongoose');

const RecyclingGuideSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    unique: true, // Assicurati che ogni oggetto sia unico
  },
  category: {
    type: String,
    enum: ['Carta', 'Plastica', 'Metalli', 'Vetro', 'Organico', 'Indifferenziato', 'Speciali', 'Elettronici'], // Aggiungi 'Elettronici' qui
    required: true,
  },
  disposalInstructions: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('RecyclingGuide', RecyclingGuideSchema);
