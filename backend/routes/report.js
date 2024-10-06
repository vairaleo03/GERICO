// routes/report.js

const express = require('express');
const passport = require('passport');

const router = express.Router();
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Segnala un cassonetto pieno
router.post(
  '/bin',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { longitude, latitude, description } = req.body;

    try {
      const report = new Report({
        user: req.user.id,
        binLocation: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        description,
      });

      await report.save();

      // Notifica agli utenti di servizio
      const services = await User.find({ role: 'service' });
      services.forEach(async (service) => {
        const notification = new Notification({
          user: service.id,
          message: `Nuova segnalazione di cassonetto pieno da ${req.user.name}`,
          type: 'bin_report', // Tipo di notifica per differenziazione
        });
        await notification.save();

        // Invia notifica in tempo reale tramite Socket.IO
        req.io.to(service.id).emit('notification', notification);
      });

      res.json({ msg: 'Segnalazione inviata con successo' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

// Ottieni tutte le segnalazioni non risolte (accessibile a tutti gli utenti autenticati)
router.get(
  '/bins',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reports = await Report.find({ resolved: false }).populate('user', 'name');
      res.json(reports);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

// Contrassegna una segnalazione come risolta (solo per utenti di tipo 'service')
router.put(
  '/bin/:id/resolve',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'service')
      return res.status(403).json({ msg: 'Accesso negato' });

    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ msg: 'Segnalazione non trovata' });
      }

      report.resolved = true;
      await report.save();

      res.json({ msg: 'Segnalazione risolta con successo' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

module.exports = router;
