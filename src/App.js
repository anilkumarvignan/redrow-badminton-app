import React, { useState } from 'react';
import './index.css';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSTp-r864MoM5LgJLFedRR5kwVWVdg5rI2AMw4UhEjL_5hdclCqH7LlZx5l9uR-qQL/exec';

const players = [
  'Anil', 'Viswa', 'Venkat', 'Ravi', 'Yeswant', 'Satya Vinay',
  'Suresh', 'Sailesh', 'Chandra', 'Abhishek', 'Naveen', 'Akshay'
];

function App() {
  const [date, setDate] = useState('');
  const [numCourts, setNumCourts] = useState(1);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [paidBy, setPaidBy] = useState('');
  const [shuttleAmount, setShuttleAmount] = useState('');

  const togglePlayer = (player) => {
    setSelectedPlayers(prev =>
      prev.includes(player)
        ? prev.filter(p => p !== player)
        : [...prev, player]
    );
  };

  const handleSave = async () => {
    const formattedDate = new Date(date);
    const displayDate = formattedDate.toLocaleDateString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: '2-digit'
    });

    const payload = {
      row: [displayDate, numCourts, ...players.map(p => selectedPlayers.includes(p) ? 'Yes' : '')]
    };

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('Saved:', await res.json());
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="container">
      <h1>Redrow Badminton</h1>

      <label>Date:
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>

      <label>Courts:
        <select value={numCourts} onChange={e => setNumCourts(Number(e.target.value))}>
          <option value={1}>1 (£10)</option>
          <option value={2}>2 (£20)</option>
        </select>
      </label>

      <h2>Players Attended</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {players.map(player => (
          <label key={player}>
            <input
              type="checkbox"
              checked={selectedPlayers.includes(player)}
              onChange={() => togglePlayer(player)}
            /> {player}
          </label>
        ))}
      </div>

      <h2>Shuttle Purchase</h2>
      <label>Amount (£):
        <input type="number" value={shuttleAmount} onChange={e => setShuttleAmount(e.target.value)} />
      </label>

      <label>Paid by:
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
          <option value="">Select</option>
          {players.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <button onClick={handleSave} style={{ marginTop: '20px' }}>Save</button>
    </div>
  );
}

export default App;