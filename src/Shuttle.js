import React, { useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySgXPakDr7rNc0ojUK6vSWubSj-lByZrXV88yqLpCEDWyUI9I1FUwZArMXhi8ivDH3/exec";

const playersList = [
  "Anil","Viswa","Venkat","Ravi","Yaswanth","Abyson","Satya Vinay",
  "Manoj","Rohit","Suresh","Sailesh","Chandra","Abhishek","Naveen",
  "Akshay","Satya","Puneeth","Uchit","Mazar","Rajesh","Satish","Praveen"
];

function Shuttles() {
  const [date, setDate] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const saveShuttle = async () => {
    setMessage("");
    if (!paidBy || !amount) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    const row = [
      date || new Date().toLocaleDateString("en-GB"),
      amount,
      paidBy
    ];

    setLoading(true);
    try {
      // Try a normal CORS POST first (lets us read server response if allowed)
      console.log("Attempting normal POST to Apps Script:", GOOGLE_SCRIPT_URL, row);
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheet: "Shuttles", row }),
      });

      // If browser allows reading response, try to parse it
      console.log("Fetch returned:", res);
      if (res.ok) {
        // Try parse body if available (may be empty on some deployments)
        let text = "";
        try { text = await res.text(); console.log("Response text:", text); } catch (e) { console.warn("No response text available:", e); }
        setMessage("✅ Shuttle expense saved successfully!");
      } else {
        // non-2xx (server error)
        const txt = await res.text().catch(() => "(no body)");
        console.error("Server returned error:", res.status, txt);
        setMessage(`❌ Server error ${res.status}. Check Apps Script logs.`);
      }
    } catch (err) {
      // Network / CORS error -> attempt no-cors fallback
      console.error("Fetch failed (likely CORS or network):", err);
      setMessage("⚠️ Network/CORS blocked the request. Attempting fallback...");

      try {
        // Fallback: send opaque request (mode: no-cors). This may still succeed server-side,
        // but we cannot read the response from the browser.
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({ sheet: "Shuttles", row }),
        });

        setMessage("⚠️ Fallback sent (no-cors). The request was sent but the browser cannot confirm success. Please check the Google Sheet to confirm.");
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
        setMessage("❌ Fallback failed as well. Check your internet connection and Apps Script deployment.");
      }
    } finally {
      setLoading(false);
      // Reset UI fields (you can change to only reset on confirmed success if you prefer)
      setDate("");
      setAmount("");
      setPaidBy("");
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
          {playersList.map(p => <option key={p} value={p}>{p}</option>)}
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

      <button onClick={saveShuttle} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Shuttles;
