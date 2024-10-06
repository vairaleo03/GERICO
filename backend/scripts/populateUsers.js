// scripts/populateUsers.js

const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require(path.join(__dirname, '..', 'models', 'User'));

async function main() {
  try {
    // Verifica che MONGO_URI sia definito
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI non definito nel file .env');
    }

    console.log('MONGO_URI:', process.env.MONGO_URI);

    // Connessione a MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      // Le opzioni useNewUrlParser e useUnifiedTopology sono deprecate nella versione 4+
    });
    console.log('Connessione a MongoDB stabilita');

    // Pulizia della collezione User
    await User.deleteMany({});
    console.log('Collezione User svuotata');

    // Creazione di utenti di esempio
    const users = [
      {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'citizen',
      },
      {
        name: 'Luigi Bianchi',
        email: 'luigi.bianchi@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'citizen',
      },
      {
        name: 'Servizio Raccolta Bari',
        email: 'raccolta.bari@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'service',
      },
      {
        name: 'Servizio Raccolta Lecce',
        email: 'raccolta.lecce@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'service',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Utenti di esempio creati');

    console.log('Popolamento degli utenti completato con successo.');
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
