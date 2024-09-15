// routes/patients.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const Patient = require('../models/Patient');

// Ottieni tutti i pazienti
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const patients = await Patient.find({ operator: req.user._id });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Aggiungi un nuovo paziente
router.post('/', ensureAuthenticated, async (req, res) => {
  console.log('Utente autenticato:', req.user); // Verifica l'utente autenticato
  console.log('Dati ricevuti:', req.body); // Verifica i dati ricevuti

  const { name, age, medicalHistory } = req.body;
  try {
    const newPatient = new Patient({
      operator: req.user._id,
      name,
      age,
      medicalHistory,
    });
    await newPatient.save();
    res.json({ message: 'Paziente aggiunto con successo', patient: newPatient });
  } catch (err) {
    console.error('Errore durante il salvataggio del paziente:', err);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Aggiorna un paziente
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const { name, age, medicalHistory } = req.body;
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, operator: req.user._id },
      { name, age, medicalHistory },
      { new: true }
    );
    if (!patient) {
      return res.status(404).json({ message: 'Paziente non trovato' });
    }
    res.json({ message: 'Paziente aggiornato con successo', patient });
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Elimina un paziente
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ _id: req.params.id, operator: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Paziente non trovato' });
    }
    res.json({ message: 'Paziente eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
});

module.exports = router;
