import { getUser } from "./auth";

const ORDERS_KEY = "foodiehub_orders";

function loadAll() {
  try {
    const s = localStorage.getItem(ORDERS_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

function saveAll(all) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  } catch {}
}

function getUserKey() {
  const u = getUser();
  // Prefer stable id if backend provides; fallback to email; else anonymous
  return (u && (u.id || u._id || u.email)) || "anonymous";
}

export function getOrders() {
  const all = loadAll();
  const key = getUserKey();
  return all[key] || [];
}

export function placeOrder({ items = [], subtotal = 0, tax = 0, total = 0 }) {
  const all = loadAll();
  const key = getUserKey();
  const list = all[key] || [];
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const order = {
    id,
    createdAt: new Date().toISOString(),
    items: items.map((it) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      imageId: it.imageId,
      quantity: it.quantity,
    })),
    subtotal,
    tax,
    total,
  };
  list.unshift(order);
  all[key] = list;
  saveAll(all);
  return order;
}
