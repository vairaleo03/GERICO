// services/openaiService.js
const axios = require('axios');

async function getDiagnosis(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('Errore nell\'interazione con OpenAI:', err.response ? err.response.data : err.message);
    throw err;
  }
}

module.exports = { getDiagnosis };
