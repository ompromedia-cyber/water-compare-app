const API_BASE = process.env.REACT_APP_API_URL;

function getToken() {
  return localStorage.getItem("admin_token");
}

async function request(path, options = {}) {
  if (!API_BASE) {
    throw new Error("REACT_APP_API_URL is not configured");
  }

  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export const fetchWaters = () => request("/waters");

export const createWater = (water) =>
  request("/waters", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(water),
  });

export const updateWater = (id, water) =>
  request(`/waters/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(water),
  });

export const deleteWater = (id) =>
  request(`/waters/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const importWaters = (waters) =>
  request("/waters/import", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ waters }),
  });

export async function login(login, password) {
  const data = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });
  localStorage.setItem("admin_token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("admin_token");
}
