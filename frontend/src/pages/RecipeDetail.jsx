import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/api";
import "../styles/global.css";

const DIFF_BADGE = {
  easy:   "badge-easy",
  medium: "badge-medium",
  hard:   "badge-hard",
};

function RecipeDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [recipe, setRecipe]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [starMsg, setStarMsg] = useState("");
  const [starring, setStarring] = useState(false);

  useEffect(() => {
    apiFetch(`/recipe/fetch/${id}`)
      .then((data) => { setRecipe(data); setLoading(false); })
      .catch((err) => { setError(err.message || "Failed to load recipe"); setLoading(false); });
  }, [id]);

  const handleToggleStar = async () => {
    setStarring(true);
    try {
      const data = await apiFetch(`/star/${id}`, { method: "POST" });
      setStarMsg(data.message);
    } catch (err) {
      setStarMsg(err.message || "Failed to update");
    } finally {
      setStarring(false);
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: 720 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: i === 0 ? 48 : 100, borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }} />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: 720, textAlign: "center", paddingTop: "4rem" }}>
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</p>
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-outline" onClick={() => navigate("/recipes")}>← Back to Recipes</button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />

      {/* ── Hero ── */}
      <div className="page-hero" style={{ padding: "3.5rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "left" }}>
          <button
            className="btn btn-ghost"
            style={{ color: "rgba(255,255,255,0.5)", padding: "0 0 1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
            onClick={() => navigate("/recipes")}
          >
            ← Back
          </button>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {recipe.difficulty && (
              <span className={`badge ${DIFF_BADGE[recipe.difficulty] || ""}`}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.tags?.map((t) => (
              <span key={t} className="tag tag-orange">#{t}</span>
            ))}
          </div>

          <h1 style={{ color: "#fff" }}>{recipe.title}<span className="accent-dot">.</span></h1>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {recipe.cookingTime && (
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>⏱ {recipe.cookingTime} min</span>
            )}
            {recipe.servings && (
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>🍽 {recipe.servings} servings</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container" style={{ maxWidth: 720 }}>

        {/* Star button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
          <button
            className="btn btn-orange"
            onClick={handleToggleStar}
            disabled={starring}
            style={{ gap: "0.5rem" }}
          >
            ★ {starring ? "Saving..." : "Star / Unstar"}
          </button>
          {starMsg && (
            <span style={{
              marginLeft: "1rem", alignSelf: "center",
              fontSize: "0.85rem", fontWeight: 700,
              color: starMsg === "Starred" ? "#059669" : "#6b7280",
            }}>
              {starMsg === "Starred" ? "✓ Starred!" : "Removed"}
            </span>
          )}
        </div>

        {/* Ingredients */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <span className="stripe" />
          <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Ingredients</h2>
          <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.5rem" }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                fontSize: "0.9rem", color: "var(--text)"
              }}>
                <span style={{ color: "var(--orange)", fontWeight: 900, fontSize: "1rem" }}>—</span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="card">
          <span className="stripe" />
          <h2 style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>Instructions</h2>
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recipe.steps.map((s, i) => (
              <li key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <span style={{
                  minWidth: 32, height: 32, borderRadius: "50%",
                  background: "var(--navy)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 700,
                  flexShrink: 0, marginTop: "0.1rem"
                }}>
                  {i + 1}
                </span>
                <p style={{ color: "var(--text)", lineHeight: 1.6, margin: 0 }}>{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;