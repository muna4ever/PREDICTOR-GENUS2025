import React, { useState, useEffect } from "react";

// Use .env to store your key: REACT_APP_SPORTMONKS_API_KEY=your_real_api_key
const SPORTMONKS_API_KEY = process.env.REACT_APP_SPORTMONKS_API_KEY;
const API_URL = `https://api.sportmonks.com/v3/football/livescores?api_token=${SPORTMONKS_API_KEY}`;

export default function SportmonksLiveScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.data) {
          setScores(data.data);
        } else {
          setScores([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  return (
    <div style={{border: "1px solid #ccc", padding: "1rem", borderRadius: 8, margin: "1rem 0"}}>
      <h2>Live Football Scores (Sportmonks)</h2>
      {loading && <p>Loading live scores...</p>}
      {error && <p style={{color:"red"}}>Error: {error}</p>}
      {!loading && !error && scores.length === 0 && <p>No live matches at the moment.</p>}
      {!loading && !error && scores.length > 0 && (
        <ul>
          {scores.map(match => (
            <li key={match.id}>
              <b>
                {match.participants && match.participants.map(p => p.name).join(" vs. ")}
              </b>
              <br />
              {match.scores && match.scores.ft_score
                ? `Score: ${match.scores.ft_score}`
                : "No score yet"}
              <br />
              {match.time && match.time.minute
                ? `Minute: ${match.time.minute}'`
                : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
