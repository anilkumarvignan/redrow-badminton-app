import React, { useEffect, useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec?sheet=Summary';

function Summary() {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    fetch(GOOGLE_SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          // Remove header from data if needed
          const [, ...rows] = data.data;
          setSummaryData(rows);
        }
      })
      .catch((err) => {
        console.error("Error fetching summary:", err);
      });
  }, []);

  return (
    <div className="container">
      <h2>Summary</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Sessions Paid (£)</th>
            <th>Shuttle Paid (£)</th>
            <th>Total Paid (£)</th>
            <th>Total Share (£)</th>
            <th>Balance (£)</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Summary;
