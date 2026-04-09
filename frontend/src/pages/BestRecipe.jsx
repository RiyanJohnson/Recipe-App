import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/api";
import "../styles/global.css";

const DIFF_BADGE = {
  easy:   "badge-easy",
  medium: "badge-medium",
  hard:   "badge-hard",
};

// Browsers strip the body from GET requests (per XHR/Fetch spec),
// so we can't call GET /recipe/best with a body from the browser.
// Instead: fetch all recipe IDs, load each full recipe in parallel,
// then replicate the backend's matching logic client-side.
async function findBestMatch(userIngredients) {
  // Step 1: get list of all recipe IDs + titles
  const recipeList = await apiFetch("/recipe/fetch"); // [{_id, title}, ...]

  if (!recipeList || recipeList.length === 0) {
    throw new Error("No recipes available");
  }

  // Step 2: fetch full details for every recipe in parallel
  // Use allSettled so one bad recipe doesn't crash the whole search
  const results = await Promise.allSettled(
    recipeList.map((r) => apiFetch(`/recipe/fetch/${r._id}`))
  );
  const fullRecipes = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);

  // Step 3: same logic as backend ingredientsSearch
  const lowerIngredients = userIngredients.map((i) => i.toLowerCase().trim());

  const matching = fullRecipes.filter((r) =>
    r.ingredients?.some((i) => lowerIngredients.includes(i.toLowerCase().trim()))
  );

  if (matching.length === 0) throw new Error("No matching recipes found");

  let bestRecipe = null;
  let maxMatch = 0;

  for (const recipe of matching) {
    const matchCount = recipe.ingredients?.filter((i) =>
      lowerIngredients.includes(i.toLowerCase().trim())
    ).length ?? 0;

    if (matchCount > maxMatch) {
      maxMatch = matchCount;
      bestRecipe = recipe;
    }
  }

  return { bestRecipe, maxMatch, total: matching.length };
}

const SUGGESTIONS = ["egg", "milk", "flour", "butter", "garlic", "chicken", "onion", "tomato"];

function BestRecipe() {
  const [input, setInput]     = useState("");
  const [chips, setChips]     = useState([]);
  const [result, setResult]   = useState(null); // { bestRecipe, maxMatch, total }
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const addChip = (val) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed && !chips.includes(trimmed)) setChips((c) => [...c, trimmed]);
    setInput("");
  };

  const removeChip = (c) => setChips((prev) => prev.filter((x) => x !== c));

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addChip(input);
    }
  };

  const handleSearch = async () => {
    const all = chips.length > 0
      ? chips
      : input.split(",").map((i) => i.trim().toLowerCase()).filter(Boolean);

    if (all.length === 0) { setError("Enter at least one ingredient."); return; }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await findBestMatch(all);
      setResult(data);
    } catch (err) {
      setError(err.message || "No matching recipe found.");
    } finally {
      setLoading(false);
    }
  };

  const recipe = result?.bestRecipe;

  return (
    <div>
      <Navbar />

      <div className="page-hero">
        <span className="label-tag">Smart Search</span>
        <h1 style={{ color: "#fff" }}>Find A Recipe<span className="accent-dot">.</span></h1>
        <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "0.75rem", maxWidth: 480, margin: "0.75rem auto 0" }}>
          Enter the ingredients you have on hand and we'll find the best matching recipe.
        </p>
      </div>

      <div className="container" style={{ maxWidth: 720 }}>

        {/* ── Input card ── */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <span className="stripe" />
          <h2 style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>Your Ingredients</h2>

          {/* Chips */}
          {chips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              {chips.map((c) => (
                <span key={c} className="tag tag-orange" style={{ gap: "0.4rem" }}>
                  {c}
                  <button
                    onClick={() => removeChip(c)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 900, fontSize: "0.9rem", lineHeight: 1 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Text input */}
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder='Type an ingredient, press Enter or ","'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Quick-add suggestions */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Quick add:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
              {SUGGESTIONS.filter((s) => !chips.includes(s)).map((s) => (
                <button
                  key={s}
                  className="tag"
                  style={{ cursor: "pointer", border: "1.5px dashed var(--border)", background: "transparent" }}
                  onClick={() => addChip(s)}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-orange" onClick={handleSearch} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Searching..." : "🔍  Find Best Recipe"}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Result ── */}
        {recipe && (
          <div className="card" style={{ animation: "fadeIn 0.35s ease" }}>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              {recipe.difficulty && (
                <span className={`badge ${DIFF_BADGE[recipe.difficulty] || ""}`}>{recipe.difficulty}</span>
              )}
              <span className="badge" style={{ background: "var(--orange-light)", color: "var(--orange)" }}>
                ★ Best Match — {result.maxMatch} of {recipe.ingredients?.length} ingredients
              </span>
              {result.total > 1 && (
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                  {result.total} recipes matched
                </span>
              )}
            </div>

            <span className="stripe" />
            <h2 style={{ marginBottom: "0.5rem" }}>{recipe.title}<span className="accent-dot">.</span></h2>

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {recipe.cookingTime && <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>⏱ {recipe.cookingTime} min</span>}
              {recipe.servings   && <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>🍽 {recipe.servings} servings</span>}
            </div>

            <h3 style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>Ingredients</h3>
            <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.4rem", marginBottom: "1.5rem" }}>
              {recipe.ingredients?.map((ing, i) => {
                const matched = chips.includes(ing.toLowerCase().trim()) ||
                  (chips.length === 0 && input.split(",").map(x => x.trim().toLowerCase()).includes(ing.toLowerCase().trim()));
                return (
                  <li key={i} style={{ fontSize: "0.88rem", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <span style={{ color: matched ? "var(--orange)" : "var(--text-muted)", fontWeight: 900 }}>
                      {matched ? "✓" : "—"}
                    </span>
                    <span style={{ color: matched ? "var(--text)" : "var(--text-muted)", fontWeight: matched ? 600 : 400 }}>
                      {ing}
                    </span>
                  </li>
                );
              })}
            </ul>

            <h3 style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>Steps</h3>
            <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
              {recipe.steps?.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{
                    minWidth: 26, height: 26, borderRadius: "50%",
                    background: "var(--navy)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ color: "var(--text)", margin: 0, lineHeight: 1.6, fontSize: "0.9rem" }}>{s}</p>
                </li>
              ))}
            </ol>

            <button className="btn btn-orange" onClick={() => navigate(`/recipes/${recipe._id}`)}>
              View Full Recipe →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default BestRecipe;