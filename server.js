const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Your API routes here ---
app.get('/api/matches/flashscore', (req, res) => {
  res.json({
    matches: [
      { id: 1, league: "Premier League", team1: "Arsenal", team2: "Chelsea", date: "2025-05-23", time: "18:00" }
    ]
  });
});
app.get('/api/matches/livescore', (req, res) => {
  res.json({
    matches: [
      { id: 2, league: "Serie A", team1: "Juventus", team2: "Inter Milan", date: "2025-05-23", time: "19:45" }
    ]
  });
});
app.get('/api/matches/espn', (req, res) => {
  res.json({
    matches: [
      { id: 3, league: "MLS", team1: "LA Galaxy", team2: "NYCFC", date: "2025-05-23", time: "20:00" }
    ]
  });
});
app.get('/api/matches/bbc', (req, res) => {
  res.json({
    matches: [
      { id: 4, league: "Championship", team1: "Leeds", team2: "Derby", date: "2025-05-23", time: "20:30" }
    ]
  });
});
app.get('/api/matches/sofascore', (req, res) => {
  res.json({
    matches: [
      { id: 5, league: "Bundesliga", team1: "Bayern", team2: "Dortmund", date: "2025-05-23", time: "18:30" }
    ]
  });
});

// --- Serve React static files for production ---
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// For any other routes, serve the React index.html (so React Router works)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
