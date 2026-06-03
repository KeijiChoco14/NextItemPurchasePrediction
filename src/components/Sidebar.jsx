import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-logo">F</div>
          <div>
            <h1>FashionAI</h1>
            <p>Deep Learning</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/recommendation">Recommendation</NavLink>
          <NavLink to="/model">Model Info</NavLink>
          <NavLink to="/dataset">Dataset Info</NavLink>
        </nav>
      </div>

      <div className="sidebar-card">
        <span>Current Model</span>
        <strong>GRU Category Predictor</strong>
      </div>
    </aside>
  );
}

export default Sidebar;