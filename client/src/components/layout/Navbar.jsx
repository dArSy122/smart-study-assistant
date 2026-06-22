import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="app-header">
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo">
          Smart Study Assistant
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/topics/create">Create Topic</NavLink>
          <NavLink to="/statistics">Statistics</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/login" className="button button-small">
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  );
}