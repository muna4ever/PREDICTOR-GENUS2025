const express = require('express');
const cors = require('cors');
const {
  scrapeLivescore,
  scrapeESPN,
  scrapeBBC,
  scrapeSofascore,
  scrapeFlashscore
} = require('./scrapers');
const { predictOutcomeAdvanced } = require('./prediction');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/matches/:site', async (req, res) => {
  const { site } = req.params;
  const { league, team, date } = req.query;
  let matches = [];
  try {
    if (site === 'livescore') matches = await scrapeLivescore();
    else if (site === 'espn') matches = await scrapeESPN();
    else if (site === 'bbc') matches = await scrapeBBC();
    else if (site === 'sofascore') matches = await scrapeSofascore();
    else if (site === 'flashscore') matches = await scrapeFlashscore();
    else return res.status(400).json({ error: 'Unknown site' });

    // Filtering
    if (league) matches = matches.filter(m => (m.league || '').toLowerCase().includes(league.toLowerCase()));
    if (team) matches = matches.filter(m => m.home.toLowerCase().includes(team.toLowerCase()) || m.away.toLowerCase().includes(team.toLowerCase()));
    if (date) matches = matches.filter(m => (m.date || '').includes(date));

    // Advanced prediction (demo uses only random fallback for extras)
    const withPredictions = matches.map(m => ({
      ...m,
      prediction: predictOutcomeAdvanced(m, {
        homeForm: ['W', 'D', 'W', 'L', 'W'].sort(() => Math.random() - 0.5),
        awayForm: ['L', 'D', 'W', 'L', 'D'].sort(() => Math.random() - 0.5),
        homeLeaguePos: Math.floor(Math.random() * 10) + 1,
        awayLeaguePos: Math.floor(Math.random() * 10) + 1,
        h2h: ['home', 'away', 'draw', 'home', 'away'].sort(() => Math.random() - 0.5)
      })
    }));

    res.json(withPredictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));