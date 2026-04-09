import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import "../styles/global.css";

const BASE_URL = "http://localhost:8080";

async function adminFetch(url, options = {}) {
  const token = localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = "Bearer " + token;

  let res;
  try {
    res = await fetch(BASE_URL + url, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the server.");
  }

  let data = null;
  try { data = await res.json(); } catch { data = null; }

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
    return;
  }
  if (!res.ok) throw new Error(typeof data === "string" ? data : data?.message || "Request failed");
  return data;
}

const EMPTY_FORM = {
  title: "",
  difficulty: "easy",
  cookingTime: "",
  servings: "",
};

const DIFF_BADGE = {
  easy:   "badge-easy",
  medium: "badge-medium",
  hard:   "badge-hard",
};

function AdminPanel() {
  const { adminToken, adminLogout } = useContext(AdminContext);
  const navigate = useNavigate();

  // Recipe list
  const [recipes, setRecipes]         = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError]     = useState("");
  const [deleting, setDeleting]       = useState(null);

  // Add form fields
  const [form, setForm]               = useState(EMPTY_FORM);
  const [ingredients, setIngredients] = useState([]);
  const [ingInput, setIngInput]       = useState("");
  const [steps, setSteps]             = useState([]);
  const [stepInput, setStepInput]     = useState("");
  const [tags, setTags]               = useState([]);
  const [tagInput, setTagInput]       = useState("");

  // Form state
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchRecipes = () => {
    setLoadingList(true);
    adminFetch("/admin/recipes")
      .then((data) => { setRecipes(data || []); setLoadingList(false); })
      .catch((err) => { setListError(err.message); setLoadingList(false); });
  };

  useEffect(() => { fetchRecipes(); }, []);

  // ── Chip helpers ──
  const addChip = (list, setList, val, setInput) => {
    const t = val.trim();
    if (t && !list.includes(t)) setList((prev) => [...prev, t]);
    setInput("");
  };

  const removeChip = (list, setList, val) =>
    setList((prev) => prev.filter((x) => x !== val));

  const handleKeyDown = (e, list, setList, inputVal, setInput) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(list, setList, inputVal, setInput);
    }
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.title.trim()) { setFormError("Title is required."); return; }
    if (steps.length === 0) { setFormError("Add at least one step."); return; }

    setSubmitting(true);
    try {
      await adminFetch("/admin/recipe", {
        method: "POST",
        body: JSON.stringify({
          title:       form.title.trim(),
          ingredients,
          steps,
          difficulty:  form.difficulty,
          cookingTime: form.cookingTime ? Number(form.cookingTime) : undefined,
          servings:    form.servings    ? Number(form.servings)    : 1,
          tags,
        }),
      });

      setFormSuccess(`"${form.title}" added successfully!`);
      setForm(EMPTY_FORM);
      setIngredients([]); setSteps([]); setTags([]);
      setIngInput(""); setStepInput(""); setTagInput("");
      fetchRecipes();
    } catch (err) {
      setFormError(err.message || "Failed to add recipe");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await adminFetch(`/admin/recipe/${id}`, { method: "DELETE" });
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Top bar ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          🍳 <span>Recipe</span>App
          <span style={{
            marginLeft: "0.75rem", background: "var(--orange)", color: "#fff",
            fontSize: "0.68rem", fontWeight: 800, padding: "0.2rem 0.6rem",
            borderRadius: "var(--radius-pill)", textTransform: "uppercase", letterSpacing: "0.08em"
          }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            User Site
          </Link>
          <button className="nav-btn-logout" onClick={() => { adminLogout(); navigate("/admin"); }}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="page-hero" style={{ padding: "3rem 2rem 2.5rem", textAlign: "center" }}>
        <span className="label-tag">Admin Panel</span>
        <h1 style={{ color: "#fff", marginTop: "0.25rem" }}>
          Manage Recipes<span className="accent-dot">.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.5rem" }}>
          Add new recipes or remove existing ones from the collection.
        </p>
      </div>

      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: "2rem", alignItems: "start" }}>

          {/* ──────────────────────────────────
              LEFT: Add Recipe Form
          ────────────────────────────────── */}
          <div>
            <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>
              ADD RECIPE<span className="accent-dot">.</span>
            </h2>

            {formError   && <div className="alert alert-error">{formError}</div>}
            {formSuccess && <div className="alert alert-success">✓ {formSuccess}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>

              {/* Title */}
              <div className="card" style={{ marginBottom: "1.25rem" }}>
                <span className="stripe" />
                <label className="form-label">Recipe Title</label>
                <input
                  type="text"
                  placeholder="e.g. Spaghetti Carbonara"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Meta row */}
              <div className="card" style={{ marginBottom: "1.25rem" }}>
                <span className="stripe" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", alignItems: "end" }}>
                  <div>
                    <label className="form-label">Difficulty</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "2px solid var(--border)",
                        padding: "0.75rem 0",
                        fontSize: "1rem",
                        fontFamily: "var(--font-sans)",
                        color: "var(--text)",
                        outline: "none",
                        cursor: "pointer",
                        appearance: "none",
                        WebkitAppearance: "none",
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 4px center",
                      }}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Cook Time (min)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="30"
                      value={form.cookingTime}
                      onChange={(e) => setForm({ ...form, cookingTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Servings</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="4"
                      value={form.servings}
                      onChange={(e) => setForm({ ...form, servings: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="card" style={{ marginBottom: "1.25rem" }}>
                <span className="stripe" />
                <label className="form-label">Ingredients</label>

                {ingredients.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                    {ingredients.map((ing) => (
                      <span key={ing} className="tag tag-orange" style={{ gap: "0.4rem" }}>
                        {ing}
                        <button type="button" onClick={() => removeChip(ingredients, setIngredients, ing)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 900, fontSize: "0.9rem", lineHeight: 1 }}>×</button>
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="e.g. 2 eggs (press Enter to add)"
                    value={ingInput}
                    onChange={(e) => setIngInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, ingredients, setIngredients, ingInput, setIngInput)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-outline"
                    style={{ padding: "0.4rem 1rem", fontSize: "0.82rem" }}
                    onClick={() => addChip(ingredients, setIngredients, ingInput, setIngInput)}>
                    + Add
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div className="card" style={{ marginBottom: "1.25rem" }}>
                <span className="stripe" />
                <label className="form-label">Steps</label>

                {steps.length > 0 && (
                  <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {steps.map((step, i) => (
                      <li key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                        <span style={{
                          minWidth: 24, height: 24, borderRadius: "50%",
                          background: "var(--navy)", color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0
                        }}>{i + 1}</span>
                        <span style={{ fontSize: "0.88rem", flex: 1, color: "var(--text)", paddingTop: "0.1rem" }}>{step}</span>
                        <button type="button" onClick={() => removeChip(steps, setSteps, step)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1, flexShrink: 0 }}>×</button>
                      </li>
                    ))}
                  </ol>
                )}

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder={`Step ${steps.length + 1} description...`}
                    value={stepInput}
                    onChange={(e) => setStepInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, steps, setSteps, stepInput, setStepInput)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-outline"
                    style={{ padding: "0.4rem 1rem", fontSize: "0.82rem" }}
                    onClick={() => addChip(steps, setSteps, stepInput, setStepInput)}>
                    + Add
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="card" style={{ marginBottom: "1.5rem" }}>
                <span className="stripe" />
                <label className="form-label">Tags <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>

                {tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                    {tags.map((t) => (
                      <span key={t} className="tag" style={{ gap: "0.4rem" }}>
                        #{t}
                        <button type="button" onClick={() => removeChip(tags, setTags, t)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 900, fontSize: "0.9rem", lineHeight: 1 }}>×</button>
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="e.g. vegetarian (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, tags, setTags, tagInput, setTagInput)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-outline"
                    style={{ padding: "0.4rem 1rem", fontSize: "0.82rem" }}
                    onClick={() => addChip(tags, setTags, tagInput, setTagInput)}>
                    + Add
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-orange"
                disabled={submitting}
                style={{ width: "100%", fontSize: "0.95rem", padding: "0.9rem 2rem" }}
              >
                {submitting ? "Adding Recipe..." : "✓ Add Recipe"}
              </button>
            </form>
          </div>

          {/* ──────────────────────────────────
              RIGHT: Existing Recipes
          ────────────────────────────────── */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1rem" }}>
                ALL RECIPES<span className="accent-dot">.</span>
              </h2>
              {!loadingList && (
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  {recipes.length} total
                </span>
              )}
            </div>

            {listError && <div className="alert alert-error">{listError}</div>}

            {loadingList && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 72, borderRadius: "var(--radius-md)" }} />
                ))}
              </div>
            )}

            {!loadingList && recipes.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
                <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🍽</p>
                <p>No recipes yet. Add one using the form.</p>
              </div>
            )}

            {!loadingList && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", maxHeight: "calc(100vh - 260px)", overflowY: "auto", paddingRight: "4px" }}>
                {recipes.map((r) => (
                  <div key={r._id} className="card" style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.25rem",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "0.92rem", textTransform: "uppercase", letterSpacing: "-0.01em", wordBreak: "break-word" }}>
                          {r.title}
                        </strong>
                        {r.difficulty && (
                          <span className={`badge ${DIFF_BADGE[r.difficulty] || ""}`}>{r.difficulty}</span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.78rem", marginTop: "0.25rem", color: "var(--text-muted)" }}>
                        {r.ingredients?.length ?? 0} ingredients · {r.steps?.length ?? 0} steps
                        {r.cookingTime ? ` · ⏱ ${r.cookingTime} min` : ""}
                      </p>
                    </div>
                    <button
                      className="btn btn-danger"
                      disabled={deleting === r._id}
                      onClick={() => handleDelete(r._id, r.title)}
                      style={{ flexShrink: 0 }}
                    >
                      {deleting === r._id ? "..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
