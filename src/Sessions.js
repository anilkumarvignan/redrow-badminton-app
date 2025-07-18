import React, { useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL6ZHyhm6TP3hH1mWHXELiqCPZa85eHjx7ecmmsAH8m-YAI9RrQ3RTBHfb9AlHTMcT/exec";

const players = [
  "Anil", "Viswa", "Venkat", "Ravi", "Yeswant", "Satya Vinay",
  "Suresh", "Sailesh", "Chandra", "Abhishek", "Naveen", "Akshay"
];

export default function Sessions() {
  const [selectedDate, setSelectedDate] = useState("");
  const [courts, setCourts] = useState(1);
  const [paidBy, setPaidBy] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const togglePlayer = (name) => {
    setSelectedPlayers(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const saveSession = async () => {
    const bookingFee = courts === 1 ? 10 : 20;
    const formattedDate = new Date(selectedDate).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "2-digit"
    });

    const row = [
      formattedDate,
      courts,
      bookingFee,
      paidBy,
      selectedPlayers.join(", ")
    ];

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheet: "Sessions", row })
    });

    alert("Session saved!");
    setSelectedDate(""); setPaidBy(""); setSelectedPlayers([]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Session Entry</h2>
      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border p-1" />
      <select value={courts} onChange={e => setCourts(Number(e.target.value))} className="ml-2 border p-1">
        <option value={1}>1 Court (£10)</option>
        <option value={2}>2 Courts (£20)</option>
      </select>
      <br /><br />
      <label className="font-semibold">Paid by:</label>
      <select value={paidBy} onChange={e => setPaidBy(e.target.value)} className="border ml-2 p-1">
        <option value="">Select</option>
        {players.map(p => <option key={p}>{p}</option>)}
      </select>
      <br /><br />
      <label className="font-semibold">Players Attended:</label>
      <div className="grid grid-cols-2 gap-1 mt-1">
        {players.map(p => (
          <label key={p}>
            <input type="checkbox" checked={selectedPlayers.includes(p)} onChange={() => togglePlayer(p)} /> {p}
          </label>
        ))}
      </div>
      <button onClick={saveSession} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Save Session
      </button>
    </div>
  );
}
