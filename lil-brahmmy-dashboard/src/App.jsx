import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard'; // Import the new Admin file

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default path takes you to Teacher Dashboard */}
          <Route path="/" element={<TeacherDashboard />} />
          
          {/* Admin path takes you to the NEW Admin Dashboard */}
          <Route path="/admin-dash" element={<AdminDashboard />} />

          {/* Fallback: redirect any unknown path to Teacher Dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;