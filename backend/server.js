// server.js
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
    origin: 'http://localhost:3000', // Aggiorna con il tuo dominio frontend se necessario
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.use(passport.initialize());
app.use(passport.session());

// Configurazione Passport
require('./config/passport')(passport);

// Rotte
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const aiRoutes = require('./routes/ai')(io); // Passiamo io qui

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/ai', aiRoutes);

// Connessione al database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connesso al database MongoDB');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server in esecuzione sulla porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Errore di connessione al database:', err);
  });


// Gestisci la connessione Socket.IO
io.on('connection', (socket) => {
  console.log('Nuovo client connesso');

  socket.on('disconnect', () => {
    console.log('Client disconnesso');
  });
});

// Non è più necessario esportare io
// module.exports = { app, io };
