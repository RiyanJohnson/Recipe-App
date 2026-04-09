import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

const PERKS = [
  { icon: "🔐", text: "Your data is secure" },
  { icon: "🍳", text: "Access the full recipe library" },
  { icon: "💾", text: "Save and star your favourites" },
];

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/");
      } else {
        setError(data || "Registration failed.");
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

          <span className="label-tag">Create account</span>
          <h2 style={{
            color: "#fff", fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            marginTop: "0.25rem", marginBottom: "1rem", lineHeight: 1.1,
          }}>
            Join the<br />
            <span style={{ color: "var(--orange)" }}>kitchen</span>
            <span style={{ color: "var(--orange)" }}>.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 300 }}>
            Create a free account to start discovering, saving, and cooking your favourite recipes.
          </p>
        </div>

        {/* Perks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {PERKS.map((p) => (
            <div key={p.text} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "var(--radius-sm)",
                background: "rgba(249,115,22,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.05rem", flexShrink: 0,
              }}>
                {p.icon}
              </div>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", fontWeight: 500 }}>
                {p.text}
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

          <span className="label-tag">Get started</span>
          <h1 style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", marginBottom: "0.5rem", marginTop: "0.25rem" }}>
            SIGN UP<span className="accent-dot">.</span>
          </h1>
          <p style={{ marginBottom: "2.5rem" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "var(--orange)", fontWeight: 700, textDecoration: "none" }}>
              Log in
            </Link>
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                placeholder="choose_a_username"
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-orange"
              disabled={loading}
              style={{ width: "100%", marginTop: "0.75rem", padding: "0.9rem 2rem" }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="flex: 0 0 42%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Register;