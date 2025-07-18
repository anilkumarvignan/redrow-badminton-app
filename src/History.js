// src/History.js
import React, { useEffect, useState } from "react";

const GOOGLE_SCRIPT_BASE = "https://script.google.com/macros/s/AKfycbxL6ZHyhm6TP3hH1mWHXELiqCPZa85eHjx7ecmmsAH8m-YAI9RrQ3RTBHfb9AlHTMcT/exec";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [shuttles, setShuttles] = useState([]);

  useEffect(() => {
    // Fetch Sessions
    fetch(`${GOOGLE_SCRIPT_BASE}?sheet=Sessions`)
      .then(res => res.json())
      .then(data => {
        const values = data.data || [];
        const headers = values[0];
        const rows = values.slice(1).reverse().slice(0, 5); // latest 5
        setSessions([headers, ...rows]);
      });

    // Fetch Shuttles
    fetch(`${GOOGLE_SCRIPT_BASE}?sheet=Shuttles`)
      .then(res => res.json())
      .then(data => {
        const values = data.data || [];
        const headers = values[0];
        const rows = values.slice(1).reverse().slice(0, 5); // latest 5
        setShuttles([headers, ...rows]);
      });
  }, []);

  const renderTable = (title, data) => (
    <div style={{ marginBottom: "2rem" }}>
      <h3>{title}</h3>
      {data.length > 1 ? (
        <table border="1" cellPadding="6">
          <thead>
            <tr>{data[0].map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => <td key={j}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No records found.</p>}
    </div>
  );

  return (
    <div>
      <h2>Latest History</h2>
      {renderTable("Recent Sessions", sessions)}
      {renderTable("Recent Shuttle Purchases", shuttles)}
    </div>
  );
}
