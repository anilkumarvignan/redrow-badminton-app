import React, { useEffect, useState } from "react";

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";

function History() {
  const [sessionsData, setSessionsData] = useState([]);
  const [shuttlesData, setShuttlesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch Sessions data
        const sessionsRes = await fetch(`${GOOGLE_SHEET_URL}?sheet=Sessions`);
        const sessionsJson = await sessionsRes.json();
        const sessionsRows = sessionsJson.data || [];

        // Fetch Shuttles data
        const shuttlesRes = await fetch(`${GOOGLE_SHEET_URL}?sheet=Shuttles`);
        const shuttlesJson = await shuttlesRes.json();
        const shuttlesRows = shuttlesJson.data || [];

        // Get last 5 records or fewer, but keep header row intact
        const lastSessions = sessionsRows.length > 1 ? [sessionsRows[0]].concat(sessionsRows.slice(-5)) : sessionsRows;
        const lastShuttles = shuttlesRows.length > 1 ? [shuttlesRows[0]].concat(shuttlesRows.slice(-5)) : shuttlesRows;

        setSessionsData(lastSessions);
        setShuttlesData(lastShuttles);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const renderTable = (title, rows) => {
    if (rows.length < 2) return <p>{title}: No records found.</p>;

    const isSessions = title.toLowerCase().includes("session");

    return (
      <div style={{ marginBottom: "40px" }}>
        <h3>{title}</h3>
        <table className="history-table" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {rows[0].map((head, i) => (
                <th
                  key={i}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                    textAlign: "left",
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                {row.map((cell, j) => {
                  if (isSessions && j === 0) {
                    // Format date for Sessions date column
                    const date = new Date(cell);
                    const options = { day: "2-digit", month: "short", year: "numeric" };
                    return <td key={j} style={{ padding: "8px" }}>{isNaN(date) ? cell : date.toLocaleDateString("en-GB", options)}</td>;
                  }
                  return (
                    <td key={j} style={{ padding: "8px" }}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {renderTable("Sessions History (Last 5 Records)", sessionsData)}
      {renderTable("Shuttles History (Last 5 Records)", shuttlesData)}
    </div>
  );
}

export default History;
