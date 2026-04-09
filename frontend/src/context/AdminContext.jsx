import { createContext, useState } from "react";

export const AdminContext = createContext();

function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken")
  );

  const adminLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  return (
    <AdminContext.Provider value={{ adminToken, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminProvider;
