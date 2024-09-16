const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: 'Credenziali non valide' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ user });
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Cancella il cookie di sessione
      res.json({ message: 'Logout effettuato con successo' });
    });
  });
});

module.exports = router;
