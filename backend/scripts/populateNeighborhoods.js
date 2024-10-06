// scripts/populateNeighborhoods.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Neighborhood = require(path.join(__dirname, '..', 'models', 'Neighborhood'));

async function main() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // Verifica il valore di MONGO_URI
    // Connessione a MongoDB senza opzioni deprecate
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connessione a MongoDB stabilita');

    const neighborhoods = [
      {
        name: 'Murat',
        postalCode: '70121',
        collectionSchedule: [
          { day: 'Lunedì', wasteType: 'Organico' },
          { day: 'Martedì', wasteType: 'Plastica' },
          { day: 'Mercoledì', wasteType: 'Carta' },
          { day: 'Giovedì', wasteType: 'Vetro' },
          { day: 'Venerdì', wasteType: 'Indifferenziato' },
        ],
      },
      {
        name: 'San Nicola',
        postalCode: '70122',
        collectionSchedule: [
          { day: 'Lunedì', wasteType: 'Carta' },
          { day: 'Martedì', wasteType: 'Organico' },
          { day: 'Mercoledì', wasteType: 'Plastica' },
          { day: 'Giovedì', wasteType: 'Indifferenziato' },
          { day: 'Venerdì', wasteType: 'Vetro' },
        ],
      },
      {
        name: 'Voglio',
        postalCode: '70123',
        collectionSchedule: [
          { day: 'Lunedì', wasteType: 'Vetro' },
          { day: 'Martedì', wasteType: 'Carta' },
          { day: 'Mercoledì', wasteType: 'Organico' },
          { day: 'Giovedì', wasteType: 'Plastica' },
          { day: 'Venerdì', wasteType: 'Indifferenziato' },
        ],
      },
      {
        name: 'Pescara',
        postalCode: '70124',
        collectionSchedule: [
          { day: 'Lunedì', wasteType: 'Indifferenziato' },
          { day: 'Martedì', wasteType: 'Vetro' },
          { day: 'Mercoledì', wasteType: 'Carta' },
          { day: 'Giovedì', wasteType: 'Organico' },
          { day: 'Venerdì', wasteType: 'Plastica' },
        ],
      },
      {
        name: 'San Ferdinando',
        postalCode: '70125',
        collectionSchedule: [
          { day: 'Lunedì', wasteType: 'Plastica' },
          { day: 'Martedì', wasteType: 'Indifferenziato' },
          { day: 'Mercoledì', wasteType: 'Vetro' },
          { day: 'Giovedì', wasteType: 'Carta' },
          { day: 'Venerdì', wasteType: 'Organico' },
        ],
      },
      {
        name: 'Centrale',
        postalCode: '70126',
        collectionSchedule: [
          { day: 'Lunedì', wasteType: 'Organico' },
          { day: 'Martedì', wasteType: 'Metalli' },
          { day: 'Mercoledì', wasteType: 'Vetro' },
          { day: 'Giovedì', wasteType: 'Plastica' },
          { day: 'Venerdì', wasteType: 'Carta' },
        ],
      },
      // Aggiungi ulteriori quartieri come necessario
    ];

    const result = await Neighborhood.insertMany(neighborhoods);
    console.log('Quartieri inseriti con successo:', result);
  } catch (err) {
    console.error('Errore durante il popolamento:', err);
  } finally {
    // Chiudi la connessione
    await mongoose.connection.close();
    console.log('Connessione a MongoDB chiusa');
    process.exit(0);
  }
}

main();
