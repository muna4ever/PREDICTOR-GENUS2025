import React from "react";
import FootballMatches from "./components/FootballMatches";

function App() {
  return (
    <div className="App">
      <h1>Football Data Viewer</h1>
      <div>
        Source Site: <b>football-data.org</b>
      </div>
      <FootballMatches site="football-data" />
    </div>
  );
}

export default App;
