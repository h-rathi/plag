import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import PlagiarismChecker from './PlagiarismChecker';
import Navbar from './Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/plagiarism" element={<PlagiarismChecker />} />
      </Routes>
    </Router>
  );
};

export default App;
