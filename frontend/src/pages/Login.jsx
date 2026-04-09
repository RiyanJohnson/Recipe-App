import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/global.css";

const FEATURES = [
  { icon: "📖", text: "Browse hundreds of recipes" },
  { icon: "⭐", text: "Star and save your favourites" },
  { icon: "🔍", text: "Find recipes by ingredient" },
];

function Login() {
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();
  const [form, setForm]   = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate("/dashboard");
      } else {
        setError(data || "Invalid credentials");
      }
    } catch {
      setError("Cannot reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Left: Navy panel ── */}
      <div style={{
        flex: "0 0 42%",
        background: "var(--navy)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 280, height: 280, borderRadius: "50%",
          border: "1.5px solid rgba(249,115,22,0.18)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 160, height: 160, borderRadius: "50%",
          border: "1.5px solid rgba(249,115,22,0.12)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -100, left: -60,
          width: 320, height: 320, borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }} />

        {/* Brand */}
        <div>
          <div style={{
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem",
            color: "#fff", marginBottom: "3.5rem",
          }}>
            🍳 <span style={{ color: "var(--orange)" }}>Recipe</span>App
          </div>

          <span className="label-tag">Welcome back</span>
          <h2 style={{
            color: "#fff", fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            marginTop: "0.25rem", marginBottom: "1rem", lineHeight: 1.1,
          }}>
            Cook something<br />
            <span style={{ color: "var(--orange)" }}>amazing</span> today
            <span style={{ color: "var(--orange)" }}>.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 300 }}>
            Your personal recipe hub — discover, save, and cook with what you have.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {FEATURES.map((f) => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "var(--radius-sm)",
                background: "rgba(249,115,22,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.05rem", flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", fontWeight: 500 }}>
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom stripe */}
        <div style={{
          height: 4, background: `linear-gradient(90deg, var(--orange), transparent)`,
          position: "absolute", bottom: 0, left: 0, right: 0,
        }} />
      </div>

      {/* ── Right: Form ── */}
      <div style={{
        flex: 1,
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2rem",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <span className="label-tag">Sign in</span>
          <h1 style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", marginBottom: "0.5rem", marginTop: "0.25rem" }}>
            LOGIN<span className="accent-dot">.</span>
          </h1>
          <p style={{ marginBottom: "2.5rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--orange)", fontWeight: 700, textDecoration: "none" }}>
              Sign up
            </Link>
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                placeholder="your_username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-orange"
              disabled={loading}
              style={{ width: "100%", marginTop: "0.75rem", padding: "0.9rem 2rem" }}
            >
              {loading ? "Signing in..." : "Login →"}
            </button>
          </form>

          {/* Admin link */}
          <p style={{ marginTop: "2rem", fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "center" }}>
            Admin?{" "}
            <Link to="/admin" style={{ color: "var(--text-muted)", fontWeight: 600, textDecoration: "underline" }}>
              Go to admin panel
            </Link>
          </p>
        </div>
      </div>

      {/* Responsive: hide left panel on small screens */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="flex: 0 0 42%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Login;