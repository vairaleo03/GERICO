// scripts/populateCollectionCenters.js

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const CollectionCenter = require(path.join(__dirname, '..', 'models', 'CollectionCenter'));

async function main() {
  try {
    // Verifica che MONGO_URI sia definito
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI non definito nel file .env');
    }

    console.log('MONGO_URI:', process.env.MONGO_URI);

    // Connessione a MongoDB con opzioni aggiornate
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connessione a MongoDB stabilita');

    // Coordinate del Centro Raccolta Bari 1
    const baseLongitude = 16.871871;
    const baseLatitude = 41.117143;

    // Funzione per generare piccole variazioni nelle coordinate
    const generateCoordinates = (lngOffset, latOffset) => [
      parseFloat((baseLongitude + lngOffset).toFixed(6)),
      parseFloat((baseLatitude + latOffset).toFixed(6)),
    ];

    const centers = [
      {
        name: 'Centro Raccolta Bari 1',
        address: 'Via Roma, 1',
        wasteTypes: ['Elettronici', 'Batterie', 'Oli Esausti'],
        openingHours: 'Lun-Ven 8:00-18:00',
        location: {
          type: 'Point',
          coordinates: generateCoordinates(0, 0), // [longitude, latitude]
        },
      },
      {
        name: 'Centro Raccolta Bari 2',
        address: 'Via Cavour, 45',
        wasteTypes: ['Vetro', 'Plastica', 'Carta'],
        openingHours: 'Lun-Sab 9:00-17:00',
        location: {
          type: 'Point',
          coordinates: generateCoordinates(0.005, 0.005),
        },
      },
      {
        name: 'Centro Raccolta Bari 3',
        address: 'Via XX Settembre, 78',
        wasteTypes: ['Organico', 'Indifferenziato', 'Metalli'],
        openingHours: 'Mart-Sab 8:30-16:30',
        location: {
          type: 'Point',
          coordinates: generateCoordinates(-0.005, 0.005),
        },
      },
      {
        name: 'Centro Raccolta Bari 4',
        address: 'Via Manzoni, 12',
        wasteTypes: ['Carta', 'Plastica', 'Vetro', 'Organico'],
        openingHours: 'Lun-Dom 10:00-20:00',
        location: {
          type: 'Point',
          coordinates: generateCoordinates(0.010, -0.005),
        },
      },
      {
        name: 'Centro Raccolta Bari 5',
        address: 'Via Garibaldi, 34',
        wasteTypes: ['Elettronici', 'Plastica', 'Indifferenziato'],
        openingHours: 'Lun-Ven 7:00-19:00',
        location: {
          type: 'Point',
          coordinates: generateCoordinates(-0.010, -0.005),
        },
      },
      // Aggiungi ulteriori centri come necessario
    ];

    // Cicla attraverso ogni centro e aggiungi o aggiorna nel database
    for (const center of centers) {
      const existingCenter = await CollectionCenter.findOne({ name: center.name });
      if (existingCenter) {
        console.log(`Centro già esistente: ${center.name}. Aggiornamento in corso...`);
        await CollectionCenter.updateOne({ name: center.name }, center);
        console.log(`Centro aggiornato: ${center.name}`);
      } else {
        console.log(`Aggiunta del centro: ${center.name}`);
        await CollectionCenter.create(center);
        console.log(`Centro aggiunto: ${center.name}`);
      }
    }

    console.log('Popolamento dei Centri di Raccolta completato con successo');
  } catch (err) {
    console.error('Errore durante il popolamento:', err.message);
  } finally {
    // Chiudi la connessione
    try {
      await mongoose.connection.close();
      console.log('Connessione a MongoDB chiusa');
    } catch (closeErr) {
      console.error('Errore durante la chiusura della connessione:', closeErr.message);
    }
    process.exit(0);
  }
}

main();
