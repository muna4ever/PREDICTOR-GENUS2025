import React, { useEffect, useState } from "react";

const FootballMatches = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call the backend endpoint for football-data.org
    fetch("http://localhost:4000/api/matches/football-data")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend error: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        // Optional: adjust according to the structure of football-data.org's response
        setMatches(data.matches || []);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Football Matches</h2>
      <ul>
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
