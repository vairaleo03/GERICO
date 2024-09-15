// routes/ai.js
const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { getDiagnosis } = require('../services/openaiService');
const AiSession = require('../models/AiSession');
const Patient = require('../models/Patient');

module.exports = function(io) {
  const router = express.Router();

  // Endpoint per ottenere una diagnosi dall'IA
  router.post('/diagnosis', ensureAuthenticated, async (req, res) => {
    const { patientId, inputData } = req.body;
    try {
      if (!patientId || !inputData) {
        return res.status(400).json({ message: 'Dati mancanti' });
      }

      const patient = await Patient.findOne({ _id: patientId, operator: req.user._id });
      if (!patient) {
        return res.status(404).json({ message: 'Paziente non trovato' });
      }

      // Prepara il prompt per OpenAI
      const prompt = `Informazioni sul paziente:
Nome: ${patient.name}
Età: ${patient.age}
Storia medica: ${patient.medicalHistory}

Dati clinici aggiuntivi: ${inputData}

Sei un medico specializzato e fornisci una diagnosi dettagliata e un piano di trattamento con massimo 300 parole.`;

      // Ottieni la risposta dall'IA
      const aiResponse = await getDiagnosis(prompt);

      // Salva la sessione
      const aiSession = new AiSession({
        operator: req.user._id,
        patient: patientId,
        inputData,
        aiResponse,
      });
      await aiSession.save();

      // Emetti un evento per notificare i client
      const sessionData = await AiSession.findById(aiSession._id)
        .populate('patient', 'name age medicalHistory'); // Popola i dati del paziente

      io.emit('newDiagnosis', sessionData);

      res.json({ message: 'Diagnosi ottenuta con successo', aiResponse });
    } catch (err) {
      console.error('Errore durante la diagnosi AI:', err);
      res.status(500).json({ message: 'Errore del server', error: err.message });
    }
  });

  // Endpoint per ottenere le sessioni AI
  router.get('/sessions', ensureAuthenticated, async (req, res) => {
    try {
      const sessions = await AiSession.find({ operator: req.user._id })
        .populate('patient', 'name age medicalHistory')
        .sort({ createdAt: -1 });

      res.json(sessions);
    } catch (err) {
      console.error('Errore durante il recupero delle sessioni AI:', err);
      res.status(500).json({ message: 'Errore del server', error: err.message });
    }
  });

  return router;
};
