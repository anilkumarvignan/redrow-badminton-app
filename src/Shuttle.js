import React, { useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL6ZHyhm6TP3hH1mWHXELiqCPZa85eHjx7ecmmsAH8m-YAI9RrQ3RTBHfb9AlHTMcT/exec";

const players = [
  "Anil", "Viswa", "Venkat", "Ravi", "Yeswant", "Satya Vinay",
  "Suresh", "Sailesh", "Chandra", "Abhishek", "Naveen", "Akshay"
];

export default function Shuttles() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [sharedWith, setSharedWith] = useState([]);

  const togglePlayer = (name) => {
    setSharedWith(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const saveShuttle = async () => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "2-digit"
    });

    const row = [
      formattedDate,
      amount,
      paidBy,
      sharedWith.join(", ")
    ];

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheet: "Shuttles", row })
    });

    alert("Shuttle expense saved!");
    setDate(""); setAmount(""); setPaidBy(""); setSharedWith([]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Shuttle Entry</h2>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-1" />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="ml-2 border p-1" placeholder="Amount" />
      <br /><br />
      <label className="font-semibold">Paid by:</label>
      <select value={paidBy} onChange={e => setPaidBy(e.target.value)} className="border ml-2 p-1">
        <option value="">Select</option>
        {players.map(p => <option key={p}>{p}</option>)}
      </select>
      <br /><br />
      <label className="font-semibold">Shared with:</label>
      <div className="grid grid-cols-2 gap-1 mt-1">
        {players.map(p => (
          <label key={p}>
            <input type="checkbox" checked={sharedWith.includes(p)} onChange={() => togglePlayer(p)} /> {p}
          </label>
        ))}
      </div>
      <button onClick={saveShuttle} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Save Shuttle
      </button>
    </div>
  );
}
