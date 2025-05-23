import React, { useState } from "react";
import FootballMatches from "./components/FootballMatches";

function App() {
  // Only one source site, so hardcode it and hide the dropdown if you want.
  const [site, setSite] = useState("football-data");

  return (
    <div className="App">
      <h1>Football Data Viewer</h1>
      {/* Select Source Site dropdown shows only football-data.org */}
      <label>
        Select Source Site:{" "}
        <select value={site} onChange={e => setSite(e.target.value)}>
          <option value="football-data">football-data.org</option>
        </select>
      </label>
      <FootballMatches site={site} />
    </div>
  );
}

export default App;
