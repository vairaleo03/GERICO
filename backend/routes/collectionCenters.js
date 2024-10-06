// routes/collectionCenters.js

const express = require('express');
const passport = require('passport');

const router = express.Router();
const CollectionCenter = require('../models/CollectionCenter');

// Ottieni la lista dei centri di raccolta
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const centers = await CollectionCenter.find();
      res.json(centers);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore del server');
    }
  }
);

module.exports = router;
