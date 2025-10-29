// Simple deviceId persisted in localStorage
const KEY = 'foodiehub_device_id';

function randomId() {
  return 'fh_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getDeviceId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // SSR or restricted storage
    return 'fh_anonymous';
  }
}
