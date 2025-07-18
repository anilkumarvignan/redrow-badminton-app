import React, { useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSTp-r864MoM5LgJLFedRR5kwVWVdg5rI2AMw4UhEjL_5hdclCqH7LlZx5l9uR-qQL/exec';
const players = ['Anil', 'Viswa', 'Venkat', 'Ravi', 'Yeswant', 'Satya Vinay', 'Suresh', 'Sailesh', 'Chandra', 'Abhishek', 'Naveen', 'Akshay'];

export default function Shuttle() {
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const togglePlayer = (player) => {
    setSelectedPlayers(prev =>
      prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]
    );
  };

  const handleSave = async () => {
    if (!amount || !paidBy || selectedPlayers.length === 0) {
      alert('Please enter amount, select who paid, and at least one player.');
      return;
    }

    const today = new Date().toLocaleDateString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: '2-digit'
    });

    const payload = {
      row: ['SHUTTLE', today, amount, paidBy, ...players.map(p => selectedPlayers.includes(p) ? 'Yes' : '')]
    };

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Shuttle expense saved successfully!');
        setAmount('');
        setPaidBy('');
        setSelectedPlayers([]);
      } else {
        alert('Failed to save shuttle expense.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving shuttle expense.');
    }
  };

  return (
    <div>
      <h2>Shuttle Purchase</h2>
      <label>Amount (£): <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" /></label>
      <label>Paid By:
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
          <option value="">Select</option>
          {players.map(p => <option key={p}>{p}</option>)}
        </select>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '1rem' }}>
        {players.map(p => (
          <label key={p}>
            <input type="checkbox" checked={selectedPlayers.includes(p)} onChange={() => togglePlayer(p)} />
            {p}
          </label>
        ))}
      </div>
      <button onClick={handleSave} style={{ marginTop: '1rem' }}>Save Shuttle</button>
    </div>
  );
}
