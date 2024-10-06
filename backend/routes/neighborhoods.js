// routes/neighborhoods.js

const express = require('express');
const passport = require('passport');

const router = express.Router();
const Neighborhood = require('../models/Neighborhood');

// Ottieni la lista dei quartieri
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const neighborhoods = await Neighborhood.find({}, 'name');
      res.json(neighborhoods);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

module.exports = router;
