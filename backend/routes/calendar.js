// routes/calendar.js

const express = require('express');
const passport = require('passport');

const router = express.Router();
const Neighborhood = require('../models/Neighborhood');

// Ottieni il calendario per un quartiere
router.get(
  '/:neighborhood',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const neighborhoodName = req.params.neighborhood;
      const neighborhood = await Neighborhood.findOne({ name: neighborhoodName });

      if (!neighborhood) {
        return res.status(404).json({ msg: 'Quartiere non trovato' });
      }

      res.json(neighborhood.collectionSchedule);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

module.exports = router;
