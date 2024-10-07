// server.js

require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();

// Middleware per CORS e parsing JSON
app.use(cors({
  origin: ['https://recyclesmart.netlify.app', 'http://localhost:3000'], // Aggiungi il tuo dominio Netlify e localhost per svilupp
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Inizializzazione di Passport
app.use(passport.initialize());
require('./config/passport')(passport);

// Creazione del server HTTP e inizializzazione di Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://recyclesmart.netlify.app', // Aggiungi il tuo dominio Netlify
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Inizializza Socket.IO
require('./sockets/index')(io);

// Middleware per rendere io disponibile in req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotte
app.use('/api/auth', require('./routes/auth'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/neighborhoods', require('./routes/neighborhoods'));
app.use('/api/report', require('./routes/report'));
app.use('/api/collectionCenters', require('./routes/collectionCenters'));
app.use('/api/recyclingGuide', require('./routes/recyclingGuide'));
app.use('/api/pickups', require('./routes/pickups'));
app.use('/api/notifications', require('./routes/notifications'));

// Connessione a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.log(err));

// Avvio del server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
