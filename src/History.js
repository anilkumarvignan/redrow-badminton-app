// src/History.js
import React, { useEffect, useState } from 'react';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxL6ZHyhm6TP3hH1mWHXELiqCPZa85eHjx7ecmmsAH8m-YAI9RrQ3RTBHfb9AlHTMcT/exec";

function History() {
  const [sessionHistory, setSessionHistory] = useState([]);
  const [shuttleHistory, setShuttleHistory] = useState([]);

  useEffect(() => {
    fetch(`${GOOGLE_SHEET_URL}?sheet=Sessions`)
      .then(res => res.json())
      .then(data => {
        const allRows = data.data || [];
        const headers = allRows[0];
        const rows = allRows.slice(1).reverse().slice(0, 5);
        setSessionHistory([headers, ...rows]);
      });

    fetch(`${GOOGLE_SHEET_URL}?sheet=Shuttles`)
      .then(res => res.json())
      .then(data => {
        const allRows = data.data || [];
        const headers = allRows[0];
        const rows = allRows.slice(1).reverse().slice(0, 5);
        setShuttleHistory([headers, ...rows]);
      });
  }, []);

  const renderTable = (title, rows) => (
    <div>
      <h3>{title}</h3>
      {rows.length > 1 ? (
        <table>
          <thead>
            <tr>{rows[0].map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      ) : <p>No records yet.</p>}
    </div>
  );

  return (
    <div>
      <h2>Recent History</h2>
      {renderTable("Latest 5 Session Records", sessionHistory)}
      {renderTable("Latest 5 Shuttle Records", shuttleHistory)}
    </div>
  );
}

export default History;
