import { Link } from 'react-router-dom';
import './Navbar.css'; // Criaremos este arquivo CSS a seguir

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/disciplinas" className="nav-link">Disciplinas</Link>
        </li>
        <li className="nav-item">
          <Link to="/professores" className="nav-link">Professores</Link>
        </li>
        <li className="nav-item">
          <Link to="/salas" className="nav-link">Salas</Link>
        </li>
        <li className="nav-item">
          <Link to="/turmas" className="nav-link">Turmas</Link>
        </li>
      </ul>
    </nav>
  );
}