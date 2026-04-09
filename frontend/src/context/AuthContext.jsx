import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  const login = (data) => {
    // data = { userId, accessToken, refreshToken }
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userId", data.userId);
    setToken(data.accessToken);
  };

  const logout = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
    } catch {
      // proceed with local logout regardless
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;