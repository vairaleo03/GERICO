require('dotenv').config();
const express = require('express');
const http = require('http'); // Modulo HTTP
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const socketIO = require('socket.io'); // Modulo Socket.IO

const app = express();
const server = http.createServer(app); // Crea il server HTTP

// Configurazione delle origini consentite (dev e produzione)
const allowedOrigins = [
  'https://main--gerico.netlify.app',
  'https://gerico.netlify.app', // Aggiungi anche questa se necessario
  'http://localhost:3000' // Origine per sviluppo locale
];

// Middleware CORS dinamico per gestire più origini
app.use(cors({
  origin: (origin, callback) => {
    // Controlla se l'origine è consentita
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non consentito per l\'origine specificata'));
    }
  },
  credentials: true,
}));

// Inizializza io prima dell'utilizzo con le stesse origini
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurazione della sessione
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersegreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Usa cookie sicuri solo in produzione
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // SameSite per cross-origin cookie
    maxAge: 1000 * 60 * 60 * 24, // 1 giorno
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Configurazione Passport
require('./config/passport')(passport);

// Connessione al database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // Abilita l'uso di indici in MongoDB, utile per performance
})
  .then(() => {
    console.log('Connesso al database MongoDB');
    
    // Avvia il server dopo la connessione al database
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server in esecuzione sulla porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Errore di connessione al database:', err);
  });

// Rotte (dopo l'inizializzazione di io)
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const aiRoutes = require('./routes/ai')(io); // Passiamo io qui ora che è inizializzato

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/ai', aiRoutes);

// Gestisci la connessione Socket.IO
io.on('connection', (socket) => {
  console.log('Nuovo client connesso');

  socket.on('disconnect', () => {
    console.log('Client disconnesso');
  });
});
