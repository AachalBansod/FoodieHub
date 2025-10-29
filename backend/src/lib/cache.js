import NodeCache from 'node-cache';
import { CACHE_TTL } from './config.js';

const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: Math.max(60, Math.floor(CACHE_TTL / 2)) });

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, value, ttl = CACHE_TTL) {
  cache.set(key, value, ttl);
}

export function cacheMiddleware(ttl = CACHE_TTL) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = getCache(key);
    if (cached) {
      return res.status(200).json(cached);
    }
    const json = res.json.bind(res);
    res.json = (body) => {
      try { setCache(key, body, ttl); } catch {}
      return json(body);
    };
    next();
  };
}
