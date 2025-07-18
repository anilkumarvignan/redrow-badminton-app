import React, { useEffect, useState } from 'react';
import './index.css'; // Make sure basic styles are included

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";

function History() {
  const [sessionHistory, setSessionHistory] = useState([]);
  const [shuttleHistory, setShuttleHistory] = useState([]);

  useEffect(() => {
    fetch(`${GOOGLE_SHEET_URL}?sheet=Sessions`)
      .then(res => res.json())
      .then(data => {
        const rows = data.data || [];
        const headers = rows[0];
        const recent = rows.slice(1).reverse().slice(0, 5);
        setSessionHistory([headers, ...recent]);
      });

    fetch(`${GOOGLE_SHEET_URL}?sheet=Shuttles`)
      .then(res => res.json())
      .then(data => {
        const rows = data.data || [];
        const headers = rows[0];
        const recent = rows.slice(1).reverse().slice(0, 5);
        setShuttleHistory([headers, ...recent]);
      });
  }, []);

  const renderTable = (title, rows) => {
    if (rows.length < 2) return <p>{title}: No records found.</p>;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h3>{title}</h3>
        <table className="history-table">
          <thead>
            <tr>{rows[0].map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h2>Recent Activity</h2>
      {renderTable("Latest 5 Session Entries", sessionHistory)}
      {renderTable("Latest 5 Shuttle Entries", shuttleHistory)}
    </div>
  );
}

export default History;
