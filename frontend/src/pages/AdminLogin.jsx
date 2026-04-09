import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import "../styles/global.css";

function AdminLogin() {
  const { adminLogin } = useContext(AdminContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        adminLogin(data.adminToken);
        navigate("/admin/panel");
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* Top bar */}
      <div style={{
        background: "var(--navy)", height: 64,
        display: "flex", alignItems: "center", padding: "0 2rem",
        justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#fff", fontSize: "1rem" }}>
          🍳 <span style={{ color: "var(--orange)" }}>Recipe</span>App
        </span>
        <Link to="/" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          ← User Login
        </Link>
      </div>

      {/* Center card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Label */}
          <span className="label-tag" style={{ display: "block", marginBottom: "0.5rem" }}>Admin Access</span>

          <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.5rem)", marginBottom: "0.5rem" }}>
            ADMIN<span className="accent-dot">.</span>
          </h1>
          <p style={{ marginBottom: "2.5rem" }}>
            Sign in to manage recipes and content.
          </p>

          {/* Error */}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                placeholder="admin"
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
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {loading ? "Signing in..." : "Sign In as Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
