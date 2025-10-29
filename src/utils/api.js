// Shared API helpers

// Safely fetch JSON. If the response isn't OK or the body isn't valid JSON,
// return null instead of throwing so the UI doesn't crash.
export async function safeFetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("HTTP error", res.status, res.statusText, errText?.slice(0, 200));
      return null;
    }

    const text = await res.text();
    if (!text) {
      console.error("Empty response body for", url);
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Non-JSON response for", url, text?.slice(0, 200));
      return null;
    }
  } catch (e) {
    console.error("Network error while fetching", url, e);
    return null;
  }
}

// Wrap a URL with a simple public CORS proxy. Use only for development.
export function toCorsProxiedUrl(url) {
  return `https://corsproxy.io/?${encodeURIComponent(url)}`;
}

// Try multiple proxy options if direct fetch fails. For development only.
const proxyWraps = [
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u) => `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
];

export async function fetchJsonWithFallback(url, extraProxies = []) {
  // 1) direct
  let json = await safeFetchJson(url);
  if (json) return json;

  // 2) proxies
  const wrappers = [
    ...proxyWraps,
    ...extraProxies.filter(Boolean),
  ];
  for (const wrap of wrappers) {
    try {
      const proxied = wrap(url);
      json = await safeFetchJson(proxied);
      if (json) return json;
    } catch (_) {
      // keep trying
    }
  }
  return null;
}
