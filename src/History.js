import React, { useEffect, useState } from "react";

const SESSIONS_URL =
  "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec?sheet=Sessions";
const SHUTTLES_URL =
  "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec?sheet=Shuttles";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; // fallback if invalid date
  const options = { day: "2-digit", month: "short", year: "2-digit" };
  return d.toLocaleDateString("en-GB", options).replace(",", "");
}

function History() {
  const [sessions, setSessions] = useState([]);
  const [shuttles, setShuttles] = useState([]);

  useEffect(() => {
    // Fetch Sessions
    fetch(SESSIONS_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 1) {
          const rows = data.data.slice(1); // remove headers
          const last10 = rows.slice(-10); // last 10
          setSessions(last10);
        }
      })
      .catch((err) => console.error("Error fetching Sessions:", err));

    // Fetch Shuttles
    fetch(SHUTTLES_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 1) {
          const rows = data.data.slice(1); // remove headers
          const last10 = rows.slice(-10); // last 10
          setShuttles(last10);
        }
      })
      .catch((err) => console.error("Error fetching Shuttles:", err));
  }, []);

  return (
    <div className="container">
      <h2>History</h2>

      {/* Sessions History */}
      <h3>Last 10 Sessions</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
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
          {sessions.length > 0 ? (
            sessions.map((row, idx) => (
              <tr key={idx}>
                <td>{formatDate(row[0])}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No session records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <br />

      {/* Shuttles History */}
      <h3>Last 10 Shuttles</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount (£)</th>
            <th>Paid By</th>
          </tr>
        </thead>
        <tbody>
          {shuttles.length > 0 ? (
            shuttles.map((row, idx) => (
              <tr key={idx}>
                <td>{formatDate(row[0])}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No shuttle records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default History;
