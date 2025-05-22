const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeLivescore() {
  const url = 'https://www.livescore.com/en/football/live/';
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);
  const matches = [];
  $('.match-row').each((i, el) => {
    const home = $(el).find('.match-row__team--home .match-row__name').text().trim();
    const away = $(el).find('.match-row__team--away .match-row__name').text().trim();
    const score = $(el).find('.match-row__score').text().trim();
    const league = $(el).closest('.LeagueContainer').find('.LeagueHeader__Title').text().trim() || '';
    if (home && away) matches.push({ home, away, score, league });
  });
  return matches;
}

async function scrapeESPN() {
  const url = 'https://www.espn.com/soccer/scoreboard';
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);
  const matches = [];
  $('.scoreboard').each((i, el) => {
    const home = $(el).find('.team.home .sb-team-short').text().trim();
    const away = $(el).find('.team.away .sb-team-short').text().trim();
    const score = $(el).find('.score-container').text().trim();
    const league = $(el).find('.league-name').text().trim() || '';
    if (home && away) matches.push({ home, away, score, league });
  });
  return matches;
}

// BBC SPORT
async function scrapeBBC() {
  const url = 'https://www.bbc.com/sport/football/scores-fixtures';
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);
  const matches = [];
  $('[data-testid="match-block"]').each((i, el) => {
    const teams = $(el).find('[data-testid="team-name-block"]');
    const home = $(teams[0]).text().trim();
    const away = $(teams[1]).text().trim();
    const score = $(el).find('[data-testid="football-score"]').text().trim();
    const league = $(el).find('[data-testid="competition-block-link"]').text().trim() || '';
    const date = $(el).attr('data-kickoff');
    if (home && away) matches.push({ home, away, score, league, date });
  });
  return matches;
}

// SOFASCORE
async function scrapeSofascore() {
  const url = 'https://www.sofascore.com/football/live';
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);
  const matches = [];
  $('[data-testid="match-row"]').each((i, el) => {
    const teams = $(el).find('[data-testid="participant-name"]');
    const home = $(teams[0]).text().trim();
    const away = $(teams[1]).text().trim();
    const score = $(el).find('[data-testid="score"]').text().trim();
    const league = $(el).find('[data-testid="tournament-name"]').text().trim() || '';
    if (home && away) matches.push({ home, away, score, league });
  });
  return matches;
}

// FLASHSCORE (basic, may require anti-bot headers/cookies for production)
async function scrapeFlashscore() {
  const url = 'https://www.flashscore.com/';
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);
  const matches = [];
  $('.event__match').each((i, el) => {
    const home = $(el).find('.event__participant--home').text().trim();
    const away = $(el).find('.event__participant--away').text().trim();
    const score = $(el).find('.event__scores').text().trim();
    const league = $(el).closest('.event__header').find('.event__title--name').text().trim() || '';
    if (home && away) matches.push({ home, away, score, league });
  });
  return matches;
}

module.exports = {
  scrapeLivescore,
  scrapeESPN,
  scrapeBBC,
  scrapeSofascore,
  scrapeFlashscore
};
