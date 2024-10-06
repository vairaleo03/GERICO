// routes/notifications.js

const express = require('express');
const passport = require('passport');

const router = express.Router();
const Notification = require('../models/Notification');

// Ottieni le notifiche dell'utente
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user.id })
        .sort({ timestamp: -1 })
        .limit(20); // Limita a 20 notifiche recenti
      res.json(notifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

module.exports = router;
