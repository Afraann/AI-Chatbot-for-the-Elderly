import React, { useState, useEffect } from "react";
import "./AddReminder.css";

function AddReminder() {
  const [reminders, setReminders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newReminder, setNewReminder] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  // Request Notification Permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Load reminders from localStorage
  useEffect(() => {
    const storedReminders = localStorage.getItem("reminders");
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
  }, []);

  // Update localStorage whenever reminders change
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  // Check reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach((reminder) => {
        const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
        if (now >= reminderTime) {
          showNotification(reminder.text);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  // Show Notification
  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("Reminder ⏰", { body: message });
    }
  };

  const handleAddReminder = () => {
    if (!newReminder.trim() || !reminderDate || !reminderTime) return;

    const newEntry = { text: newReminder, date: reminderDate, time: reminderTime };
    setReminders([...reminders, newEntry]);
    setNewReminder("");
    setReminderDate("");
    setReminderTime("");
    setShowPopup(false);
  };

  const handleDeleteReminder = (index) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  return (
    <div className="reminder-container">
      <h2>📝 Your Reminders</h2>
      <ul className="reminder-list">
        {reminders.map((reminder, index) => (
          <li key={index} className="reminder-item">
            <div className="reminder-details">
              <p><strong>🔔 {reminder.text}</strong></p>
              <p>📅 {reminder.date} | ⏰ {reminder.time}</p>
            </div>
            <button onClick={() => handleDeleteReminder(index)} className="delete-btn">🗑️ Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowPopup(true)} className="add-btn">➕ Add Reminder</button>

      {showPopup && (
        <div className="modal-overlay">
          <div className="popup-modal">
            <h3>➕ Add New Reminder</h3>
            <input type="text" placeholder="Enter reminder..." value={newReminder} onChange={(e) => setNewReminder(e.target.value)} />
            <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
            <div className="modal-btns">
              <button onClick={handleAddReminder} className="submit-btn">✅ Save</button>
              <button onClick={() => setShowPopup(false)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddReminder;
