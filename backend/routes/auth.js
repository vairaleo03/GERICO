// routes/auth.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Registrazione
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email già registrata' });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'Utente registrato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ message: 'Credenziali non valide' });
    }
    req.logIn(user, err => {
      if (err) return next(err);
      console.log('Login effettuato per l\'utente:', user);
      res.json({
        message: 'Login effettuato con successo',
        user: { id: user._id, name: user.name, email: user.email },
      });
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: 'Logout effettuato con successo' });
  });
});

module.exports = router;
