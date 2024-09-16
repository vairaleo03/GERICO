require('dotenv').config();
const express = require('express');
const http = require('http'); // Modulo HTTP
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const MongoStore = require('connect-mongo'); // Per gestire le sessioni con MongoDB
const socketIO = require('socket.io'); // Modulo Socket.IO

const app = express();
const server = http.createServer(app); // Crea il server HTTP

// Imposta CORS con le origini consentite
const allowedOrigins = [
  'https://main--gerico.netlify.app', // Netlify production
  'https://gerico.netlify.app',       // Netlify fallback
  'http://localhost:3000'             // Local development
];

// Middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origine non consentita per CORS'));
    }
  },
  credentials: true,
}));

// Inizializza io con le stesse impostazioni CORS
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware per il parsing di JSON e form URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurazione della sessione con connect-mongo
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersegreto',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,  // Usa MongoDB per memorizzare le sessioni
    collectionName: 'sessions',         // Nome della collezione in MongoDB
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Usa cookie sicuri solo in produzione (HTTPS)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Per supportare i cookie cross-origin
    maxAge: 1000 * 60 * 60 * 24, // 1 giorno
  },
}));

// Configurazione Passport.js
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // Configura passport con la strategia locale

// Debug sessioni per vedere se vengono serializzate/deserializzate
passport.serializeUser((user, done) => {
  console.log('Serializzazione utente:', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    console.log('Deserializzazione utente:', user);
    done(err, user);
  });
});

// Definisci le rotte
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const aiRoutes = require('./routes/ai')(io); // Passiamo io qui

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/ai', aiRoutes);

// Connessione al database MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connesso al database MongoDB');
    
    // Avvia il server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server in esecuzione sulla porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Errore di connessione al database:', err);
  });

// Gestione delle connessioni Socket.IO
io.on('connection', (socket) => {
  console.log('Nuovo client connesso');
  
  socket.on('disconnect', () => {
    console.log('Client disconnesso');
  });
});
