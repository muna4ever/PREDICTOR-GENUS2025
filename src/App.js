import React, { useState } from "react";
import FootballMatches from "./components/FootballMatches";

function App() {
  // State for source site (dropdown selection)
  const [site, setSite] = useState("football-data");

  return (
    <div className="App">
      <h1>Football Data Viewer</h1>
      {/* Source Site Selector */}
      <label>
        Select Source Site:{" "}
        <select value={site} onChange={e => setSite(e.target.value)}>
          <option value="football-data">football-data.org</option>
          {/* Add more sources here if needed */}
          {/* <option value="sofascore">Sofascore</option> */}
        </select>
      </label>
      {/* Pass the site as a prop to FootballMatches */}
      <FootballMatches site={site} />
    </div>
  );
}

export default App;
