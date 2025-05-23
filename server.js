const express = require('express');
const cors = require('cors');
const {
  scrapeLivescore,
  scrapeESPN,
  scrapeBBC,
  scrapeSofascore,
  scrapeFlashscore
} = require('./scrapers');

const app = express();
app.use(cors());
app.use(express.json());

// Utility: check if a match is today (expects match.date as ISO string or YYYY-MM-DD)
function isToday(match) {
  if (!match.date) return false;
  const matchDate = new Date(match.date);
  const today = new Date();
  return matchDate.getDate() === today.getDate() &&
         matchDate.getMonth() === today.getMonth() &&
         matchDate.getFullYear() === today.getFullYear();
}

// Utility: deduplicate matches by home, away, and date
function dedupeMatches(matches) {
  const seen = new Set();
  return matches.filter(m => {
    const key = `${(m.home || '').toLowerCase()}|${(m.away || '').toLowerCase()}|${(m.date || '')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Advanced statistical prediction logic for football markets
function advancedPredictions(match) {
  // For demonstration, simulate recent form and league positions if missing
  const homeForm = match.homeForm || ['W','W','D','L','W'].sort(() => Math.random() - 0.5);
  const awayForm = match.awayForm || ['L','D','W','L','D'].sort(() => Math.random() - 0.5);
  const homeLeaguePos = match.homeLeaguePos || Math.floor(Math.random() * 10) + 1;
  const awayLeaguePos = match.awayLeaguePos || Math.floor(Math.random() * 10) + 1;

  // Calculate form scores
  const formScore = arr => arr.reduce((acc, val) => 
    acc + (val === 'W' ? 3 : val === 'D' ? 1 : 0), 0
  );
  const homeFormScore = formScore(homeForm);
  const awayFormScore = formScore(awayForm);

  // League position advantage (lower position = better team)
  let leagueAdvantage = 0;
  if (homeLeaguePos && awayLeaguePos) {
    leagueAdvantage = (awayLeaguePos - homeLeaguePos) / Math.max(homeLeaguePos, awayLeaguePos);
  }

  // Calculate base probabilities
  let homeProb = 0.4 + 0.02 * (homeFormScore - awayFormScore) + 0.1 * leagueAdvantage;
  let drawProb = 0.25 - 0.01 * Math.abs(homeFormScore - awayFormScore);
  let awayProb = 0.35 - 0.02 * (homeFormScore - awayFormScore) - 0.1 * leagueAdvantage;

  // Clamp probabilities to [0,1], then normalize
  [homeProb, drawProb, awayProb] = [homeProb, drawProb, awayProb].map(x => Math.max(0, Math.min(1, x)));
  const norm = homeProb + drawProb + awayProb;
  homeProb /= norm;
  drawProb /= norm;
  awayProb /= norm;

  // Pick main prediction
  let winner;
  if (homeProb > drawProb && homeProb > awayProb) winner = 'home';
  else if (awayProb > homeProb && awayProb > drawProb) winner = 'away';
  else winner = 'draw';

  // Probability-based markets
  return {
    '12': winner === 'draw' ? (homeProb > awayProb ? 'home' : 'away') : winner,
    '1X': winner === 'home' || winner === 'draw',
    '2X': winner === 'away' || winner === 'draw',
    'X': winner === 'draw',
    'winner': winner,
    'probabilities': { home: homeProb.toFixed(2), draw: drawProb.toFixed(2), away: awayProb.toFixed(2) },
    'correctScore': guessCorrectScore(homeProb, awayProb, drawProb),
    'explain': `Prediction based on recent form (home: ${homeForm.join('')}, away: ${awayForm.join('')}), league position (home: ${homeLeaguePos}, away: ${awayLeaguePos}), and weighted probability.`
  };
}

// Helper: Guess correct score based on probabilities
function guessCorrectScore(homeProb, awayProb, drawProb) {
  // Very naive: higher home = 2-0/2-1, higher away = 0-2/1-2, draw = 1-1/0-0
  if (homeProb > 0.5) return Math.random() > 0.5 ? "2-0" : "2-1";
  if (awayProb > 0.5) return Math.random() > 0.5 ? "0-2" : "1-2";
  if (drawProb > 0.35) return Math.random() > 0.5 ? "1-1" : "0-0";
  // Otherwise, pick a plausible football score
  const options = ["1-0", "0-1", "2-2", "3-1", "1-3"];
  return options[Math.floor(Math.random() * options.length)];
}

// Home page route
app.get('/', (req, res) => {
  res.send(`
    <h2>Football Predictor API</h2>
    <ul>
      <li>GET <code>/api/predict/today</code> - Scrape all sources, deduplicate, return today’s predictions</li>
    </ul>
  `);
});

// Single endpoint: scrape all, filter today, deduplicate, predict
app.get('/api/predict/today', async (req, res) => {
  try {
    const sites = [
      scrapeLivescore,
      scrapeESPN,
      scrapeBBC,
      scrapeSofascore,
      scrapeFlashscore
    ];
    let allMatches = [];
    for (const scrape of sites) {
      try {
        const matches = await scrape();
        // Debug: log what each scraper returns and their date fields
        console.log(`From ${scrape.name}:`, matches.map(m => ({ home: m.home, away: m.away, date: m.date })));
        allMatches = allMatches.concat(matches.filter(isToday));
      } catch (e) {
        console.error(`Error in ${scrape.name}:`, e);
        continue;
      }
    }
    allMatches = dedupeMatches(allMatches);

    const predictions = allMatches.map(match => ({
      ...match,
      predictions: advancedPredictions(match)
    }));

    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
