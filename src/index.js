import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AddReminder from './AddReminder';
import DailyPuzzle from './DailyPuzzle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/addReminder" element={<AddReminder />} />
        <Route path="/dailyPuzzle" element={<DailyPuzzle />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
