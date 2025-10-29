import { Router } from 'express';
import axios from 'axios';
import { SWIGGY_DEFAULT_LAT, SWIGGY_DEFAULT_LNG } from '../lib/config.js';
import { cacheMiddleware } from '../lib/cache.js';

const router = Router();

function listUrl({ lat, lng }) {
  const latQ = encodeURIComponent(lat || SWIGGY_DEFAULT_LAT || '18.5204');
  const lngQ = encodeURIComponent(lng || SWIGGY_DEFAULT_LNG || '73.8567');
  return `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${latQ}&lng=${lngQ}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
}

function menuUrl({ id, lat, lng }) {
  const latQ = encodeURIComponent(lat || SWIGGY_DEFAULT_LAT || '18.5204');
  const lngQ = encodeURIComponent(lng || SWIGGY_DEFAULT_LNG || '73.8567');
  const idQ = encodeURIComponent(id);
  return `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${latQ}&lng=${lngQ}&restaurantId=${idQ}&submitAction=ENTER`;
}

// List restaurants (proxied)
router.get('/api/restaurants', cacheMiddleware(), async (req, res) => {
  const { lat, lng } = req.query;
  const url = listUrl({ lat, lng });
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ ok: false, error: 'Upstream error', status, details: err.message });
  }
});

// Restaurant menu (proxied)
router.get('/api/restaurants/:id', cacheMiddleware(), async (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.query;
  const url = menuUrl({ id, lat, lng });
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ ok: false, error: 'Upstream error', status, details: err.message });
  }
});

export default router;
