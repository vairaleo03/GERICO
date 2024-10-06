// routes/pickups.js

const express = require('express');
const passport = require('passport');

const router = express.Router();
const Pickup = require('../models/Pickup');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Prenotazione di un ritiro speciale
router.post(
  '/pickup',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'citizen')
      return res.status(403).json({ msg: 'Accesso negato' });

    const { wasteType, scheduledDate } = req.body;

    try {
      const pickup = new Pickup({
        citizen: req.user.id,
        wasteType,
        scheduledDate,
      });

      await pickup.save();

      // Notifica al servizio di raccolta
      const services = await User.find({ role: 'service' });

      services.forEach(async (service) => {
        const notification = new Notification({
          user: service.id,
          message: `Nuova richiesta di ritiro speciale da ${req.user.name}`,
          type: 'special_pickup', // Campo 'type' obbligatorio
        });
        await notification.save();

        // Invia notifica in tempo reale tramite Socket.IO
        req.io.to(service.id).emit('notification', {
          message: `Nuova richiesta di ritiro speciale da ${req.user.name}`,
          type: 'special_pickup',
        });
      });

      res.json({ msg: 'Prenotazione effettuata con successo' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

// Ottenere le prenotazioni dell'utente
router.get(
  '/my',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const pickups = await Pickup.find({ citizen: req.user.id });
      res.json(pickups);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

// Annulla una prenotazione
router.delete(
  '/pickup/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const pickup = await Pickup.findById(req.params.id);

      if (!pickup) {
        return res.status(404).json({ msg: 'Prenotazione non trovata' });
      }

      if (pickup.citizen.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Non autorizzato' });
      }

      pickup.status = 'cancelled';
      await pickup.save();

      res.json({ msg: 'Prenotazione annullata con successo' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

// Modifica una prenotazione
router.put(
  '/pickup/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { wasteType, scheduledDate } = req.body;

    try {
      const pickup = await Pickup.findById(req.params.id);

      if (!pickup) {
        return res.status(404).json({ msg: 'Prenotazione non trovata' });
      }

      if (pickup.citizen.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Non autorizzato' });
      }

      if (pickup.status !== 'pending') {
        return res.status(400).json({ msg: 'Non è possibile modificare questa prenotazione' });
      }

      pickup.wasteType = wasteType || pickup.wasteType;
      pickup.scheduledDate = scheduledDate || pickup.scheduledDate;

      await pickup.save();

      res.json({ msg: 'Prenotazione modificata con successo' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

// Ottenere tutte le prenotazioni pendenti (solo per 'service')
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'service')
      return res.status(403).json({ msg: 'Accesso negato' });

    try {
      const pickups = await Pickup.find({ status: 'pending' })
        .populate('citizen', 'name email');
      res.json(pickups);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

// Contrassegna un ritiro come completato (solo per 'service')
router.put(
  '/pickup/:id/complete',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'service')
      return res.status(403).json({ msg: 'Accesso negato' });

    try {
      const pickup = await Pickup.findById(req.params.id);

      if (!pickup) {
        return res.status(404).json({ msg: 'Prenotazione non trovata' });
      }

      pickup.status = 'completed';
      await pickup.save();

      res.json({ msg: 'Ritiro contrassegnato come completato' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

module.exports = router;
