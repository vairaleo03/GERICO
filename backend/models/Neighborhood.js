// models/Neighborhood.js

const mongoose = require('mongoose');

const CollectionScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'], // Opzionale: Aggiungi enumerazione per i giorni
  },
  wasteType: {
    type: String,
    required: true,
    enum: ['Organico', 'Plastica', 'Carta', 'Vetro', 'Indifferenziato', 'Metalli'], // Opzionale: Aggiungi enumerazione per i tipi di rifiuti
  },
});

const NeighborhoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Assicurati che ogni quartiere sia unico
  },
  postalCode: {
    type: String,
    required: true,
  },
  collectionSchedule: {
    type: [CollectionScheduleSchema],
    required: true,
  },
});

module.exports = mongoose.model('Neighborhood', NeighborhoodSchema);
