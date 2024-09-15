const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

// Registrazione
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verifica se l'utente esiste già
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Crea un nuovo utente con la password criptata
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Risposta di successo
    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (err) {
    // Gestione degli errori di server
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);  // Gestione dell'errore nel middleware
    if (!user) {
      return res.status(400).json({ message: 'Credenziali non valide' }); // Utente non trovato
    }

    // Login dell'utente
    req.logIn(user, err => {
      if (err) return next(err);  // Gestione dell'errore nel login
      console.log('Login effettuato per l\'utente:', user);

      // Risposta con i dettagli dell'utente
      res.json({
        message: 'Login effettuato con successo',
        user: { id: user._id, name: user.name, email: user.email },
      });
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);  // Gestione dell'errore nel logout
    res.json({ message: 'Logout effettuato con successo' });
  });
});

module.exports = router;
