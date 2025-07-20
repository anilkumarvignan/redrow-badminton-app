import React, { useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";

function Shuttles() {
  const [date, setDate] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [players, setPlayers] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const playersList = ["Anil", "Viswa", "Venkat", "Ravi", "Yaswanth", "Satya Vinay", "Suresh", "Sailesh", "Chandra", "Abhishek", "Naveen", "Akshay", "Satya"];

const saveShuttle = async () => {
  if (!paidBy || players.length === 0 || !amount) {
    setMessage("Please fill all required fields.");
    return;
  }

  const row = [new Date().toLocaleDateString("en-GB"), amount, paidBy, players.join(", ")];

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheet: "Shuttles", row }),
    });

    setMessage("Shuttle expense saved successfully!");
    
    // Reset form fields here
     setDate("");
    setAmount("");
    setPaidBy("");
    setPlayers([]);
  } catch (err) {
    console.error(err);
    setMessage("Error saving shuttle expense. Please try again.");
  }
};


  
  const togglePlayer = (player) => {
    setPlayers(prev => prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]);
  };

  return (
    <div>
      <h2>Shuttle Expenses</h2>
      <label>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><br />
      <label>Paid By:
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
          <option value="">Select</option>
          {playersList.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </label><br />
      <label>Players to split:</label><br />
      {playersList.map(p => (
        <label key={p} style={{ marginRight: 10 }}>
          <input type="checkbox" checked={players.includes(p)} onChange={() => togglePlayer(p)} /> {p}
        </label>
      ))}
      <br />
      <label>Amount (£): <input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></label>
      <br /><br />
      <button onClick={saveShuttle}>Save</button>
      <p>{message}</p>
    </div>
  );
}

export default Shuttles;
