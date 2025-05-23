import React, { useEffect, useState } from "react";

const FootballMatches = ({ site }) => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!site) return;
    setError(null);
    setMatches([]);
    fetch(`http://localhost:4000/api/matches/${site}`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend error: " + res.status);
        return res.json();
      })
      .then((data) => {
        setMatches(data.matches || []);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
      });
  }, [site]);

  return (
    <div>
      <h2>Football Matches</h2>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <ul>
        {matches.length === 0 && !error && <li>No matches found.</li>}
        {matches.map((match) => (
          <li key={match.id}>
            {match.homeTeam?.name} vs {match.awayTeam?.name} — {match.utcDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FootballMatches;
