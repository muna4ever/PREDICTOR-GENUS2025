require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Endpoint for fetching matches from football-data.org
app.get('/api/matches/:site', async (req, res) => {
  const { site } = req.params;
  if (site === 'football-data') {
    try {
      const response = await fetch('https://api.football-data.org/v4/matches', {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_DATA_API_TOKEN
        }
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch from football-data.org' });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Server error: ' + error.message });
    }
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
