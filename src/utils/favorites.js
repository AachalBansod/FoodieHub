import { API_BASE_URL } from "../config";
import { apiFetch } from "./auth";

export async function fetchFavorites() {
  if (!API_BASE_URL) return { items: [] };
  try {
    const json = await apiFetch(`/api/favorites`);
    return json?.items ? json : { items: [] };
  } catch {
    return { items: [] };
  }
}

export async function addFavorite(restaurantId, info = {}) {
  if (!API_BASE_URL) return { ok: false };
  try {
    const res = await apiFetch(`/api/favorites`, { method: "POST", body: { restaurantId, info } });
    return res;
  } catch {
    return { ok: false };
  }
}

export async function removeFavorite(restaurantId) {
  if (!API_BASE_URL) return { ok: false };
  try {
    const res = await apiFetch(`/api/favorites/${encodeURIComponent(restaurantId)}`, { method: "DELETE" });
    return res;
  } catch {
    return { ok: false };
  }
}
