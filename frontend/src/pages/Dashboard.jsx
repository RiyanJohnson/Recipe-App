import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/api";
import "../styles/global.css";

const FEATURES = [
  {
    path:  "/recipes",
    icon:  "📖",
    title: "Browse Recipes",
    desc:  "Explore our full collection of recipes with ingredients and step-by-step instructions.",
    cta:   "View All →",
  },
  {
    path:  "/starred",
    icon:  "⭐",
    title: "Starred Recipes",
    desc:  "Quick access to the recipes you've saved and loved.",
    cta:   "View Saved →",
  },
  {
    path:  "/best",
    icon:  "🔍",
    title: "Find By Ingredient",
    desc:  "Tell us what's in your fridge and we'll find the best matching recipe.",
    cta:   "Search Now →",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ recipes: "—", starred: "—" });

  useEffect(() => {
    // Fetch recipe count
    apiFetch("/recipe/fetch")
      .then((data) => setCounts((c) => ({ ...c, recipes: data.length })))
      .catch(() => {});

    // Fetch starred count
    apiFetch("/star")
      .then((data) => setCounts((c) => ({ ...c, starred: data.length })))
      .catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />

      {/* ── Hero ── */}
      <div className="page-hero" style={{ textAlign: "center", padding: "4rem 2rem 3rem" }}>
        <span className="label-tag">Welcome back</span>
        <h1 style={{ color: "#fff", marginTop: "0.25rem" }}>
          Your Recipe<span className="accent-dot">.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "0.75rem", maxWidth: 480, margin: "0.75rem auto 0" }}>
          Everything you need to cook something amazing — right here.
        </p>
      </div>

      <div className="container">

        {/* ── Stats row ── */}
        <div className="grid-2" style={{ maxWidth: 560, margin: "0 auto 3rem" }}>
          <div className="card-stat">
            <span className="card-stat-value">{counts.recipes}</span>
            <span className="card-stat-label">Total Recipes</span>
          </div>
          <div className="card-stat">
            <span className="card-stat-value">{counts.starred}</span>
            <span className="card-stat-label">Starred by You</span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="divider">
          <span className="divider-label">what would you like to do?</span>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid-3" style={{ marginTop: "1.5rem" }}>
          {FEATURES.map((f) => (
            <div
              key={f.path}
              className="feature-card"
              onClick={() => navigate(f.path)}
            >
              <div className="feature-icon">{f.icon}</div>
              <div>
                <p className="feature-title">{f.title}</p>
                <p className="feature-desc" style={{ marginTop: "0.4rem" }}>{f.desc}</p>
              </div>
              <span className="feature-arrow">{f.cta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;