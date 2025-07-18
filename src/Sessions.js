import React, { useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOviN26bY7wDKmcs4zvSsWxd_4V-ubHgmAxLEyad6X6BKKhKIpNiE65jZ4iPKLfh91/exec";

function Sessions() {
  const [date, setDate] = useState("");
  const [courts, setCourts] = useState(1);
  const [paidBy, setPaidBy] = useState("");
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");

  const playersList = ["Anil", "Viswa", "Venkat", "Ravi", "Yeswant", "Satya Vinay", "Suresh", "Sailesh", "Chandra", "Abhishek", "Naveen", "Akshay"];

  const saveSession = async () => {
    if (!date || !paidBy || players.length === 0) {
      setMessage("Please fill all required fields.");
      return;
    }

    const bookingFee = courts === 1 ? 10 : 20;
    const row = [date, courts, bookingFee, paidBy, players.join(", ")];

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",    // important to avoid CORS errors
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sheet: "Sessions", row }),
      });
      setMessage("Session saved! Please refresh to see updates.");
    } catch (err) {
      console.error(err);
      setMessage("Error saving session.");
    }
  };

  const togglePlayer = (player) => {
    setPlayers(prev => prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]);
  };

  return (
    <div>
      <h2>Sessions</h2>
      <label>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><br />
      <label>No. of Courts:
        <select value={courts} onChange={e => setCourts(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </label><br />
      <label>Paid By:
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
          <option value="">Select</option>
          {playersList.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </label><br />
      <label>Players:</label><br />
      {playersList.map(p => (
        <label key={p} style={{ marginRight: 10 }}>
          <input type="checkbox" checked={players.includes(p)} onChange={() => togglePlayer(p)} /> {p}
        </label>
      ))}
      <br /><br />
      <button onClick={saveSession}>Save</button>
      <p>{message}</p>
    </div>
  );
}

export default Sessions;
