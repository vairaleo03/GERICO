require('dotenv').config();
const express = require('express');
const http = require('http'); // Importa il modulo HTTP
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const socketIO = require('socket.io'); // Importa Socket.IO

const app = express();
const server = http.createServer(app); // Crea il server HTTP
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://gerico.netlify.app'], // Aggiungi qui i domini frontend
    credentials: true,
  },
});

// Middleware CORS per consentire solo gli origin corretti
const allowedOrigins = ['http://localhost:3000', 'https://gerico.netlify.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Non consentito da CORS'));
    }
  },
  credentials: true,
}));

// Middleware per gestire le richieste
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sessioni
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersegreto', // Assicurati di avere una SESSION_SECRET nel tuo .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Imposta a true se usi HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 giorno
  },
}));

// Passport.js per autenticazione
app.use(passport.initialize());
app.use(passport.session());

// Configurazione Passport
require('./config/passport')(passport);

// Rotte API
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const aiRoutes = require('./routes/ai')(io); // Passiamo io a aiRoutes

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/ai', aiRoutes);

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connesso al database MongoDB');
  
  // Avvio del server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
  });
}).catch(err => {
  console.error('Errore di connessione al database:', err);
});

// Gestione connessioni Socket.IO
io.on('connection', (socket) => {
  console.log('Nuovo client connesso');

  socket.on('disconnect', () => {
    console.log('Client disconnesso');
  });
});