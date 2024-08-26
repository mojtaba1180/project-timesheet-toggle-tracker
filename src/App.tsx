import "./App.css";
import TimeTrackingTable from "./components/time-traking";
import { useState, useEffect } from "react";

function App() {
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    fetch("/assets/time.json")
      .then((response) => response.json())
      .then((data) => setTimeEntries(data.TimeEntries))
      .catch((error) => console.error("Error fetching the JSON file:", error));
  }, []);

  return <TimeTrackingTable TimeEntries={timeEntries} />;
}

export default App;
