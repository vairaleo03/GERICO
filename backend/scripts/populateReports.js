// scripts/populateReports.js

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require(path.join(__dirname, '..', 'models', 'User'));
const Report = require(path.join(__dirname, '..', 'models', 'Report'));

async function main() {
  try {
    // Verifica che MONGO_URI sia definito
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI non definito nel file .env');
    }

    console.log('MONGO_URI:', process.env.MONGO_URI);

    // Connessione a MongoDB senza opzioni deprecate
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connessione a MongoDB stabilita');

    // Trova utenti con ruolo 'citizen'
    const citizens = await User.find({ role: 'citizen' });

    if (citizens.length === 0) {
      throw new Error('Nessun utente con ruolo "citizen" trovato nel database.');
    }

    // Coordinate di esempio per i cassonetti (puoi modificarle)
    const reports = [
      {
        user: citizens[0]._id,
        binLocation: {
          type: 'Point',
          coordinates: [16.871871, 41.117143], // Bari
        },
        description: 'Cassonetto traboccante vicino al parco centrale.',
      },
      {
        user: citizens[1]._id,
        binLocation: {
          type: 'Point',
          coordinates: [16.880000, 41.120000], // Bari
        },
        description: 'Cassonetto pieno accanto alla scuola elementare.',
      },
      {
        user: citizens[0]._id,
        binLocation: {
          type: 'Point',
          coordinates: [16.875000, 41.118000], // Bari
        },
        description: 'Cassonetto pieno accanto al supermercato.',
      },
      {
        user: citizens[1]._id,
        binLocation: {
          type: 'Point',
          coordinates: [16.865000, 41.113000], // Bari
        },
        description: 'Cassonetto pieno vicino all\'ospedale.',
      },
      // Aggiungi ulteriori segnalazioni come necessario
    ];

    // Inserisci le segnalazioni nel database
    for (const reportData of reports) {
      const existingReport = await Report.findOne({
        user: reportData.user,
        'binLocation.coordinates': reportData.binLocation.coordinates,
        description: reportData.description,
      });

      if (existingReport) {
        console.log('Segnalazione già esistente:', existingReport);
      } else {
        const report = new Report(reportData);
        await report.save();
        console.log('Segnalazione creata:', report);
      }
    }

    console.log('Popolamento delle segnalazioni completato con successo.');
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
