import React, { useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";

const playersList = [
  "Anil","Viswa","Venkat","Ravi","Yaswanth","Abyson","Vishal", "Satya Vinay",
  "Manoj","Rohit","Suresh","Sailesh","Chandra","Abhishek","Naveen",
  "Akshay","Satya","Puneeth","Uchit","Mazar","Rajesh","Satish","Praveen"
];

function Shuttles() {
  const [date, setDate] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const saveShuttle = async () => {
    if (!paidBy || !amount) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    // Only 3 fields → Date | Amount | Paid By
    const row = [
      date || new Date().toLocaleDateString("en-GB"),
      amount,
      paidBy
    ];

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // ✅ Always use no-cors, so no warnings
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheet: "Shuttles", row }),
      });

      setMessage("✅ Shuttle expense saved successfully!");

      // Reset form
      setDate("");
      setAmount("");
      setPaidBy("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving shuttle expense. Please try again.");
    }
  };

  return (
    <div>
      <h2>Shuttle Expenses</h2>

      <label>
        Date:{" "}
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </label>
      <br />

      <label>
        Paid By:{" "}
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
          <option value="">Select</option>
          {playersList.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Amount (£):{" "}
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </label>
      <br /><br />

      <button onClick={saveShuttle}>Save</button>
      <p>{message}</p>
    </div>
  );
}

export default Shuttles;
