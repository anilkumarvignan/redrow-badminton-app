import React, { useState } from 'react';
import './index.css';
import Sessions from './Sessions';
import Shuttle from './Shuttle';
import Summary from './Summary';
import History from './History'; // ✅ New import

function App() {
  const [tab, setTab] = useState('sessions');

  return (
    <div className="container">
      <h1>Redrow Badminton</h1>
      <nav>
        <button className={tab === 'sessions' ? 'active' : ''} onClick={() => setTab('sessions')}>Sessions</button>
        <button className={tab === 'shuttle' ? 'active' : ''} onClick={() => setTab('shuttle')}>Shuttle Expenses</button>
        <button className={tab === 'summary' ? 'active' : ''} onClick={() => setTab('summary')}>Summary</button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>History</button> {/* ✅ New tab */}
      </nav>

      {tab === 'sessions' && <Sessions />}
      {tab === 'shuttle' && <Shuttle />}
      {tab === 'summary' && <Summary />}
      {tab === 'history' && <History />} {/* ✅ New section */}
    </div>
  );
}

export default App;
