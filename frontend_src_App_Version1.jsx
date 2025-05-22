import React, { useState } from "react";

const SITES = [
  { name: "Livescore", value: "livescore" },
  { name: "ESPN", value: "espn" },
  { name: "BBC Sport", value: "bbc" },
  { name: "Sofascore", value: "sofascore" },
  { name: "Flashscore", value: "flashscore" },
];

export default function App() {
  const [site, setSite] = useState(SITES[0].value);
  const [league, setLeague] = useState('');
  const [team, setTeam] = useState('');
  const [date, setDate] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    setMatches([]);
    const params = new URLSearchParams();
    if (league) params.append('league', league);
    if (team) params.append('team', team);
    if (date) params.append('date', date);
    const res = await fetch(`http://localhost:4000/api/matches/${site}?${params}`);
    const data = await res.json();
    setMatches(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, background: "#f7f9fa", borderRadius: 12 }}>
      <h2>⚽ Sophisticated Soccer Prediction App</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          Select Source Site:&nbsp;
          <select value={site} onChange={e => setSite(e.target.value)}>
            {SITES.map(s => (
              <option key={s.value} value={s.value}>{s.name}</option>
            ))}
          </select>
        </label>
        <button onClick={fetchMatches} style={{ marginLeft: 12 }}>
          Fetch & Predict
        </button>
      </div>
      <div style={{ margin: "12px 0" }}>
        <label>League: <input value={league} onChange={e => setLeague(e.target.value)} style={{ marginRight: 8 }}/></label>
        <label>Team: <input value={team} onChange={e => setTeam(e.target.value)} style={{ marginRight: 8 }}/></label>
        <label>Date: <input value={date} onChange={e => setDate(e.target.value)} placeholder="YYYY-MM-DD" /></label>
      </div>

      {loading && <p>Loading matches...</p>}

      <ul>
        {matches.map((m, i) => (
          <li key={i} style={{ margin: '16px 0', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <b>{m.home}</b> vs <b>{m.away}</b> <span style={{ color: '#888' }}>{m.score && `(${m.score})`}</span>
            <br />
            <span style={{ fontSize: 14, color: "#345" }}>{m.league && `League: ${m.league} `}</span>
            <span style={{ fontSize: 14, color: "#345" }}>{m.date && `| Date: ${m.date}`}</span>
            <br />
            <span>Prediction: <b>{m.prediction}</b></span>
          </li>
        ))}
      </ul>
    </div>
  );
}