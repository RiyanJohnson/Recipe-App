const BASE_URL = "http://localhost:8080";

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  let res;
  try {
    res = await fetch(BASE_URL + url, { ...options, headers });
  } catch {
    // fetch() itself threw — server is unreachable or CORS blocked
    throw new Error("Cannot reach the server. Make sure the backend is running on port 8080.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    window.location.href = "/";
    return;
  }

  if (!res.ok) {
    throw new Error(typeof data === "string" ? data : data?.message || "Request failed");
  }

  return data;
};