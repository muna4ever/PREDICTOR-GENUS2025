const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Home page route
app.get('/', (req, res) => {
  res.send(`
    <h2>Football Predictor API</h2>
    <ul>
      <li>GET <code>/api/predict/today</code> - Scrape all sources, deduplicate, return today’s predictions</li>
    </ul>
  `);
});

// NEW: Flashscore matches route (dummy example)
app.get('/api/matches/flashscore', (req, res) => {
  // Replace this with real fetching/scraping logic as needed
  res.json({
    matches: [
      {
        id: 1,
        league: "Premier League",
        team1: "Arsenal",
        team2: "Chelsea",
        date: "2025-05-23",
        time: "18:00"
      },
      {
        id: 2,
        league: "La Liga",
        team1: "Real Madrid",
        team2: "Barcelona",
        date: "2025-05-23",
        time: "21:00"
      }
    ]
  });
});

// (Other API routes can go here, e.g., /api/predict/today)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
