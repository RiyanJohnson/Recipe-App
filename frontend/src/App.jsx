import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { AdminContext } from "./context/AdminContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Starred from "./pages/Starred";
import BestRecipe from "./pages/BestRecipe";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" />;
}

function AdminRoute({ children }) {
  const { adminToken } = useContext(AdminContext);
  return adminToken ? children : <Navigate to="/admin" />;
}

function App() {
  const { token } = useContext(AuthContext);
  const { adminToken } = useContext(AdminContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public / User Auth ── */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

        {/* ── Protected User Routes ── */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/recipes"   element={<PrivateRoute><Recipes /></PrivateRoute>} />
        <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
        <Route path="/starred"   element={<PrivateRoute><Starred /></PrivateRoute>} />
        <Route path="/best"      element={<PrivateRoute><BestRecipe /></PrivateRoute>} />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={adminToken ? <Navigate to="/admin/panel" /> : <AdminLogin />} />
        <Route path="/admin/panel" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;