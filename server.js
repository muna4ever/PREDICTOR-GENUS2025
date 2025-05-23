const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// This dynamic route matches /api/matches/sofascore
app.get('/api/matches/:site', (req, res) => {
  const { site } = req.params;
  const { league, team, date } = req.query;
  // Dummy response for demonstration
  if (site === 'sofascore') {
    res.json([
      {
        home: "Bayern",
        away: "Dortmund",
        league: "Bundesliga",
        date: "2025-05-23",
        prediction: "2-1",
        score: "1-0"
      }
    ]);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
