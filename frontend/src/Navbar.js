import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/plagiarism">Plagiarism Checker</Link>
      <div className="ms-auto">
        {!token && location.pathname === '/login' && (
          <Link className="btn btn-outline-light me-2" to="/signup">Sign Up</Link>
        )}
        {!token && location.pathname === '/signup' && (
          <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
        )}
        {token && (
          <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
