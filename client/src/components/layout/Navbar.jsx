import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle.jsx';

export default function Navbar() {
  return (
    <header className="app-header">
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-mark">SSA</span>
          <span>Smart Study Assistant</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/topics/create">Create Topic</NavLink>
          <NavLink to="/statistics">Statistics</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <ThemeToggle />
          <NavLink to="/login" className="button button-primary button-small">
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  );
}