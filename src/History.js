import React, { useEffect, useState } from 'react';

const BASE_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";

function History() {
  const [sessions, setSessions] = useState([]);
  const [shuttles, setShuttles] = useState([]);

  useEffect(() => {
    // Fetch Sessions
    fetch(`${BASE_URL}?sheet=Sessions`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 1) {
          const [, ...rows] = data.data;
          setSessions(rows.slice(-5)); // last 5
        }
      });

    // Fetch Shuttles
    fetch(`${BASE_URL}?sheet=Shuttles`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 1) {
          const [, ...rows] = data.data;
          setShuttles(rows.slice(-5)); // last 5
        }
      });
  }, []);

  return (
    <div className="container">
      <h2>History</h2>

      {/* Sessions History */}
      <h3>Recent Sessions</h3>
      {sessions.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Courts</th>
              <th>Booking Fee (£)</th>
              <th>Paid By</th>
              <th>Players</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((row, idx) => (
              <tr key={idx}>
                <td>{row[0]?.split("T")[0] || row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No session records available.</p>
      )}

      {/* Shuttle History */}
      <h3 style={{ marginTop: "20px" }}>Recent Shuttle Expenses</h3>
      {shuttles.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount (£)</th>
              <th>Paid By</th>
            </tr>
          </thead>
          <tbody>
            {shuttles.map((row, idx) => (
              <tr key={idx}>
                <td>{row[0]?.split("T")[0] || row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No shuttle records available.</p>
      )}
    </div>
  );
}

export default History;
