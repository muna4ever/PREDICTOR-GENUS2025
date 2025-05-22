// Advanced prediction: weighs form, league position, head-to-head, and randomness
function predictOutcomeAdvanced(match, extras = {}) {
  let score = 0;
  if (extras.homeForm && extras.awayForm) {
    const homeWins = extras.homeForm.filter(f => f === 'W').length;
    const awayWins = extras.awayForm.filter(f => f === 'W').length;
    score += (homeWins - awayWins) * 2;
  }
  if (extras.homeLeaguePos && extras.awayLeaguePos) {
    if (extras.homeLeaguePos < extras.awayLeaguePos) score += 2;
    else if (extras.homeLeaguePos > extras.awayLeaguePos) score -= 2;
  }
  if (extras.h2h) {
    const homeWins = extras.h2h.filter(r => r === 'home').length;
    const awayWins = extras.h2h.filter(r => r === 'away').length;
    score += (homeWins - awayWins);
  }
  score += (Math.random() - 0.5) * 2;
  if (score > 2) return `${match.home} strong favorite`;
  if (score > 0.5) return `${match.home} slight edge`;
  if (score < -2) return `${match.away} strong favorite`;
  if (score < -0.5) return `${match.away} slight edge`;
  return "Draw likely";
}
module.exports = { predictOutcomeAdvanced };