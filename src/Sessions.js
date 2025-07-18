import React, { useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSTp-r864MoM5LgJLFedRR5kwVWVdg5rI2AMw4UhEjL_5hdclCqH7LlZx5l9uR-qQL/exec';
const players = ['Anil', 'Viswa', 'Venkat', 'Ravi', 'Yeswant', 'Satya Vinay', 'Suresh', 'Sailesh', 'Chandra', 'Abhishek', 'Naveen', 'Akshay'];

export default function Sessions() {
  const [date, setDate] = useState('');
  const [numCourts, setNumCourts] = useState(1);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [paidBy, setPaidBy] = useState('');

  const togglePlayer = (player) => {
    setSelectedPlayers(prev =>
      prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]
    );
  };

  const handleSave = async () => {
    if (!date || !paidBy || selectedPlayers.length === 0) {
      alert('Please select date, paid by, and at least one player.');
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: '2-digit'
    });

    const payload = {
      row: ['SESSION', formattedDate, numCourts, paidBy, ...players.map(p => selectedPlayers.includes(p) ? 'Yes' : '')]
    };

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Session saved successfully!');
        // Reset form
        setDate('');
        setNumCourts(1);
        setSelectedPlayers([]);
        setPaidBy('');
      } else {
        alert('Failed to save session.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving session.');
    }
  };

  return (
    <div>
      <h2>Session Entry</h2>
      <label>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <label>No. of Courts:
        <select value={numCourts} onChange={e => setNumCourts(Number(e.target.value))}>
          <option value={1}>1 (£10)</option>
          <option value={2}>2 (£20)</option>
        </select>
      </label>
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
      <button onClick={handleSave} style={{ marginTop: '1rem' }}>Save Session</button>
    </div>
  );
}
