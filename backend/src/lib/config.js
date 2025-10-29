import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
export const SWIGGY_DEFAULT_LAT = process.env.SWIGGY_DEFAULT_LAT || '';
export const SWIGGY_DEFAULT_LNG = process.env.SWIGGY_DEFAULT_LNG || '';
export const CACHE_TTL = parseInt(process.env.CACHE_TTL || '300', 10); // seconds
