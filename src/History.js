import React, { useEffect, useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [shuttles, setShuttles] = useState([]);

  useEffect(() => {
    fetchData('Sessions', setSessions);
    fetchData('Shuttles', setShuttles);
  }, []);

  const fetchData = async (sheet, setData) => {
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${sheet}`);
      const json = await res.json();
      if (json.data && json.data.length > 1) {
        const rowsWithoutHeader = json.data.slice(1); // Remove header
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

  const renderTable = (title, headers, data, isSessions) => (
    <div style={{ marginBottom: '2rem' }}>
      <h2>{title}</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ textAlign: 'center' }}>No recent entries</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => {
                  let value = cell ?? '';
                  if (isSessions && j === 0) {
                    const date = new Date(value);
                    const options = { day: '2-digit', month: 'short', year: '2-digit' };
                    value = isNaN(date) ? value : date.toLocaleDateString('en-GB', options);
                  }
                  return <td key={j}>{value}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h1>Recent History</h1>
      {renderTable(
        'Last 5 Sessions',
        ['Date', 'Courts', 'Booking Fee', 'Paid By', 'Players'],
        sessions,
        true
      )}
      {renderTable(
        'Last 5 Shuttle Expenses',
        ['Date', 'Amount', 'Paid By', 'Players'],
        shuttles,
        false
      )}
    </div>
  );
};

export default History;
