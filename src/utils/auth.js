import { API_BASE_URL } from "../config";

const TOKEN_KEY = "foodiehub_token";
const USER_KEY = "foodiehub_user";
const authBus = new EventTarget();

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function getUser() {
  try {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken();
}

export function setAuth(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token || "");
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    authBus.dispatchEvent(new Event("auth-changed"));
  } catch {}
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    authBus.dispatchEvent(new Event("auth-changed"));
  } catch {}
}

export function onAuthChange(cb) {
  const handler = () => cb();
  authBus.addEventListener("auth-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    authBus.removeEventListener("auth-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

export async function apiFetch(path, { method = "GET", headers = {}, body } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const token = getToken();
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
  return json;
}
