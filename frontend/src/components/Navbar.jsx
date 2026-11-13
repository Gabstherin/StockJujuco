import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo-circle">JJ</div>
        <div>
          <span className="navbar-title">StockJujuco</span>
          <span className="navbar-subtitle">Juju Co. Confeitaria</span>
        </div>
      </Link>

      <ul className="navbar-nav">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Início
          </NavLink>
        </li>
        <li>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? 'active' : ''}>
            Produtos
          </NavLink>
        </li>
        <li>
          <NavLink to="/ingredientes" className={({ isActive }) => isActive ? 'active' : ''}>
            Ingredientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/precificacao" className={({ isActive }) => isActive ? 'active' : ''}>
            Custos & Precificação
          </NavLink>
        </li>
        <li>
          <NavLink to="/estoque" className={({ isActive }) => isActive ? 'active' : ''}>
            Estoque
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
