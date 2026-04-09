import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/api";
import "../styles/global.css";

const DIFF_BADGE = {
  easy:   "badge-easy",
  medium: "badge-medium",
  hard:   "badge-hard",
};

function RecipeCard({ recipe, onClick }) {
  return (
    <div className="card card-clickable" onClick={onClick} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "1rem", textTransform: "uppercase", letterSpacing: "-0.01em", margin: 0 }}>
          {recipe.title}
        </h3>
        {recipe.difficulty && (
          <span className={`badge ${DIFF_BADGE[recipe.difficulty] || ""}`}>
            {recipe.difficulty}
          </span>
        )}
      </div>

      {recipe.ingredients && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
          {recipe.ingredients.slice(0, 4).join(" · ")}{recipe.ingredients.length > 4 ? " ..." : ""}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "auto" }}>
        {recipe.cookingTime && (
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>⏱ {recipe.cookingTime} min</span>
        )}
        {recipe.servings && (
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>🍽 {recipe.servings} servings</span>
        )}
      </div>

      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        View Recipe →
      </span>
    </div>
  );
}

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/recipe/fetch")
      .then((data) => { setRecipes(data); setLoading(false); })
      .catch((err) => { setError(err.message || "Failed to load recipes"); setLoading(false); });
  }, []);

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="page-hero">
        <span className="label-tag">Collection</span>
        <h1 style={{ color: "#fff" }}>All Recipes<span className="accent-dot">.</span></h1>
        <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "0.5rem" }}>
          {!loading && `${recipes.length} recipes available`}
        </p>
      </div>

      <div className="container">
        {/* Search bar */}
        <div style={{ maxWidth: 480, margin: "0 auto 2.5rem" }}>
          <input
            type="search"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "#fff",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-pill)",
              padding: "0.75rem 1.5rem",
              fontSize: "0.95rem",
              outline: "none",
              boxShadow: "var(--shadow-sm)",
              transition: "var(--transition)",
            }}
            onFocus={(e)  => (e.target.style.borderColor = "var(--orange)")}
            onBlur={(e)   => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {loading && (
          <div className="grid-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🍽</p>
            <h2 style={{ fontSize: "1.4rem" }}>No recipes found</h2>
            <p style={{ marginTop: "0.5rem" }}>Try a different search term.</p>
          </div>
        )}

        {!loading && (
          <div className="grid-auto">
            {filtered.map((r) => (
              <RecipeCard key={r._id} recipe={r} onClick={() => navigate(`/recipes/${r._id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recipes;