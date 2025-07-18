import React, { useEffect, useState } from 'react';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";

function History() {
  const [sessionHistory, setSessionHistory] = useState([]);
  const [shuttleHistory, setShuttleHistory] = useState([]);

  useEffect(() => {
    fetch(`${GOOGLE_SHEET_URL}?sheet=Sessions`)
      .then(res => res.json())
      .then(data => {
        const allRows = data.data || [];
        const headers = allRows[0] || ["Date", "Courts", "Booking Fee", "Paid By", "Players"];
        const rows = allRows.slice(1).reverse().slice(0, 5);
        if (rows.length > 0) {
          setSessionHistory([headers, ...rows]);
        }
      });

    fetch(`${GOOGLE_SHEET_URL}?sheet=Shuttles`)
      .then(res => res.json())
      .then(data => {
        const allRows = data.data || [];
        const headers = allRows[0] || ["Date", "Amount", "Paid By", "Players"];
        const rows = allRows.slice(1).reverse().slice(0, 5);
        if (rows.length > 0) {
          setShuttleHistory([headers, ...rows]);
        }
      });
  }, []);

  const renderTable = (title, rows) => (
    <div style={{ marginBottom: '30px' }}>
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
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );

  return (
    <div>
      <h2>Recent Activity</h2>
      {renderTable("Latest 5 Session Entries", sessionHistory)}
      {renderTable("Latest 5 Shuttle Entries", shuttleHistory)}
    </div>
  );
}

export default History;
