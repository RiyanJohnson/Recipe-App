import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/global.css";

const NAV_LINKS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/recipes",   label: "Recipes"   },
  { path: "/starred",   label: "Starred"   },
  { path: "/best",      label: "Find"      },
];

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        🍳 <span>Recipe</span>App
      </div>

      <div className="navbar-links">
        {NAV_LINKS.map(({ path, label }) => (
          <button
            key={path}
            className={`nav-btn ${location.pathname === path ? "active" : ""}`}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}

        <button className="nav-btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;