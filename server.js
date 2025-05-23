require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/api/matches/football-data', async (req, res) => {
  try {
    const response = await fetch('https://api.football-data.org/v4/matches', {
      headers: { 'X-Auth-Token': process.env.a99f297052584b1f85b4a62734cbd330 }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from football-data.org' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
