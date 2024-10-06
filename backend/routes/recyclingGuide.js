// routes/recyclingGuide.js

const express = require('express');
const passport = require('passport');

const router = express.Router();
const RecyclingGuide = require('../models/RecyclingGuide');

// Cerca un oggetto per nome
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { query } = req.query;

    try {
      const results = await RecyclingGuide.find({
        itemName: { $regex: query, $options: 'i' },
      });

      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

module.exports = router;
