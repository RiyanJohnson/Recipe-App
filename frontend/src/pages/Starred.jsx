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

function Starred() {
  const [recipes, setRecipes]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [removing, setRemoving]   = useState(null); // id being removed
  const navigate = useNavigate();

  const fetchStarred = () => {
    setLoading(true);
    apiFetch("/star")
      .then((data) => { setRecipes(data); setLoading(false); })
      .catch((err) => { setError(err.message || "Failed to load"); setLoading(false); });
  };

  useEffect(() => { fetchStarred(); }, []);

  const handleUnstar = async (id) => {
    setRemoving(id);
    try {
      await apiFetch(`/star/${id}`, { method: "POST" });
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message || "Failed to remove");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-hero">
        <span className="label-tag">Saved</span>
        <h1 style={{ color: "#fff" }}>Starred Recipes<span className="accent-dot">.</span></h1>
        {!loading && (
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "0.5rem" }}>
            {recipes.length === 0 ? "Nothing saved yet" : `${recipes.length} recipe${recipes.length > 1 ? "s" : ""} saved`}
          </p>
        )}
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="grid-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⭐</p>
            <h2 style={{ fontSize: "1.4rem" }}>No starred recipes</h2>
            <p style={{ marginTop: "0.5rem", marginBottom: "2rem" }}>
              Star any recipe while browsing to save it here.
            </p>
            <button className="btn btn-orange" onClick={() => navigate("/recipes")}>
              Browse Recipes →
            </button>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid-auto">
            {recipes.map((r) => (
              <div key={r._id} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                {/* Heading row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <h3
                    style={{ fontSize: "1rem", margin: 0, cursor: "pointer" }}
                    onClick={() => navigate(`/recipes/${r._id}`)}
                  >
                    {r.title}
                  </h3>
                  {r.difficulty && (
                    <span className={`badge ${DIFF_BADGE[r.difficulty] || ""}`}>{r.difficulty}</span>
                  )}
                </div>

                {/* Ingredients preview */}
                {r.ingredients?.length > 0 && (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                    {r.ingredients.slice(0, 4).join(" · ")}{r.ingredients.length > 4 ? " ..." : ""}
                  </p>
                )}

                {/* Meta row */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {r.cookingTime && (
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>⏱ {r.cookingTime} min</span>
                  )}
                  {r.servings && (
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>🍽 {r.servings} servings</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                  <button
                    className="btn btn-orange"
                    style={{ flex: 1, padding: "0.55rem 1rem", fontSize: "0.8rem" }}
                    onClick={() => navigate(`/recipes/${r._id}`)}
                  >
                    View →
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={removing === r._id}
                    onClick={() => handleUnstar(r._id)}
                  >
                    {removing === r._id ? "..." : "✕ Unstar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Starred;