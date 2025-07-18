import React, { useEffect, useState } from "react";

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";


function History() {
  const [sessionsData, setSessionsData] = useState([]);
  const [shuttleData, setShuttleData] = useState([]);

  useEffect(() => {
    fetchData("Sessions", setSessionsData);
    fetchData("Shuttles", setShuttleData);
  }, []);

  const fetchData = async (sheet, setData) => {
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${sheet}`);
      const json = await res.json();
      if (json.data && json.data.length > 1) {
        // Remove header row and take last 5 rows
        const rowsWithoutHeader = json.data.slice(1);
        const lastFive = rowsWithoutHeader.slice(-5);
        setData(lastFive);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(`Error fetching ${sheet}:`, error);
      setData([]);
    }
  };

  const renderTable = (rows, headers, isSessions = false) => {
    return (
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr>
            {headers.map((head, i) => (
              <th
                key={i}
                style={{
                  borderBottom: "2px solid #333",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f0f0f0",
                }}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                {row.map((cell, j) => {
                  if (isSessions && j === 0) {
                    // Format date for Sessions date column
                    const date = new Date(cell);
                    const options = { day: "2-digit", month: "short", year: "numeric" };
                    return (
                      <td key={j} style={{ padding: "8px" }}>
                        {isNaN(date) ? cell : date.toLocaleDateString("en-GB", options)}
                      </td>
                    );
                  }
                  return (
                    <td key={j} style={{ padding: "8px" }}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} style={{ padding: "8px", fontStyle: "italic" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Latest Sessions</h2>
      {renderTable(
        sessionsData,
        ["Date", "Courts", "Booking Fee", "Paid By", "Players"],
        true
      )}

      <h2>Latest Shuttles</h2>
      {renderTable(shuttleData, ["Date", "Amount", "Paid By", "Players"])}
    </div>
  );
}

export default History;
