// scripts/populateRecyclingGuide.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const RecyclingGuide = require(path.join(__dirname, '..', 'models', 'RecyclingGuide'));

async function main() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // Verifica il valore di MONGO_URI
    // Connessione a MongoDB senza opzioni deprecate
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connessione a MongoDB stabilita');

    const items = [
      {
        itemName: 'Cartone della pizza',
        category: 'Carta',
        disposalInstructions:
          "Se pulito, conferire nel bidone della carta. Se sporco, nell'indifferenziato.",
      },
      {
        itemName: 'Bottiglia di plastica',
        category: 'Plastica',
        disposalInstructions:
          'Rimuovere il tappo e conferire nel bidone della plastica.',
      },
      {
        itemName: 'Pile esauste',
        category: 'Speciali',
        disposalInstructions:
          'Portare presso i centri di raccolta o nei contenitori dedicati.',
      },
      {
        itemName: 'Lattina di alluminio',
        category: 'Metalli',
        disposalInstructions:
          'Pulire la lattina e conferire nel bidone dei metalli.',
      },
      {
        itemName: 'Bottiglia di vetro',
        category: 'Vetro',
        disposalInstructions:
          'Rimuovere eventuali tappi e conferire nel bidone del vetro.',
      },
      {
        itemName: 'Carta da giornale',
        category: 'Carta',
        disposalInstructions:
          'Confidare nel bidone della carta, assicurandosi che sia pulita.',
      },
      {
        itemName: 'Olio esausto',
        category: 'Speciali',
        disposalInstructions:
          'Portare l\'olio presso i centri di raccolta dedicati o nei contenitori appositi.',
      },
      {
        itemName: 'Elettrodomestico vecchio',
        category: 'Elettronici',
        disposalInstructions:
          'Portare l\'elettrodomestico presso i centri di raccolta rifiuti elettronici.',
      },
      {
        itemName: 'Scatola di cartone',
        category: 'Carta',
        disposalInstructions:
          'Se pulita, conferire nel bidone della carta. Altrimenti, nell\'indifferenziato.',
      },
      {
        itemName: 'Smalti e vernici',
        category: 'Speciali',
        disposalInstructions:
          'Portare smalti e vernici presso i centri di raccolta rifiuti pericolosi.',
      },
      {
        itemName: 'Latta di cibo in scatola',
        category: 'Metalli',
        disposalInstructions:
          'Rimuovere eventuali residui e conferire nel bidone dei metalli.',
      },
      {
        itemName: 'Bottiglia di vetro colorato',
        category: 'Vetro',
        disposalInstructions:
          'Conferire nel bidone del vetro, separando i colori se necessario.',
      },
      {
        itemName: 'Bottiglia di plastica PET',
        category: 'Plastica',
        disposalInstructions:
          'Conferire nel bidone della plastica, assicurandosi che sia vuota e pulita.',
      },
      {
        itemName: 'Bottiglia di plastica HDPE',
        category: 'Plastica',
        disposalInstructions:
          'Conferire nel bidone della plastica, assicurandosi che sia vuota e pulita.',
      },
      {
        itemName: 'Bottiglia di plastica LDPE',
        category: 'Plastica',
        disposalInstructions:
          'Conferire nel bidone della plastica, assicurandosi che sia vuota e pulita.',
      },
      {
        itemName: 'Rifiuti organici',
        category: 'Organico',
        disposalInstructions:
          'Confidare nel bidone dell\'organico per il compostaggio.',
      },
      {
        itemName: 'Vetro rotto',
        category: 'Vetro',
        disposalInstructions:
          'Mettere il vetro rotto nel bidone del vetro, avvolgendo eventuali pezzi per sicurezza.',
      },
      // Aggiungi ulteriori oggetti qui
    ];

    const result = await RecyclingGuide.insertMany(items);
    console.log('Guida al riciclaggio popolata con successo:', result);
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
