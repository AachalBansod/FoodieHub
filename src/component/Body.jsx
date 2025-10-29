import RestrauntCard from "./RestrauntCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { filterData } from "../utils/helper";
import useOnline from "../utils/useOnline";
import { safeFetchJson, toCorsProxiedUrl } from "../utils/api";
import { LATITUDE, LONGITUDE, API_BASE_URL } from "../config";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "../utils/favorites";
import { isLoggedIn } from "../utils/auth";

const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredRestaurants, setfilteredRestaurants] = useState([]);
  const [allRestaurants, setallRestaurants] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getRestaurants();
    if (isLoggedIn()) {
      (async () => {
        const data = await fetchFavorites();
        const ids = new Set(
          (data.items || []).map((it) => String(it.restaurantId))
        );
        setFavoriteIds(ids);
      })();
    }
  }, []);

  async function getRestaurants() {
    let json = null;
    // Try backend (same-origin or configured base) first
    {
      const base = API_BASE_URL || "";
      const url = `${base}/api/restaurants?lat=${encodeURIComponent(
        LATITUDE
      )}&lng=${encodeURIComponent(LONGITUDE)}`;
      json = await safeFetchJson(url);
    }
    if (!json && process.env.NODE_ENV !== "production") {
      // Swiggy home/list API (legacy) fallback for local dev without backend
      const baseUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${encodeURIComponent(
        LATITUDE
      )}&lng=${encodeURIComponent(
        LONGITUDE
      )}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
      json =
        (await safeFetchJson(baseUrl)) ||
        (await safeFetchJson(toCorsProxiedUrl(baseUrl)));
    }

    const restaurants = extractRestaurants(json);
    setallRestaurants(restaurants || []);
    setfilteredRestaurants(restaurants || []);
  }

  // Try to robustly find the restaurants array across possible response variants
  function extractRestaurants(json) {
    if (!json) return null;
    // Common legacy path
    const legacy =
      json?.data?.cards?.[4]?.card?.card?.gridElements?.infoWithStyle
        ?.restaurants;
    if (Array.isArray(legacy) && legacy.length) return legacy;

    // Scan cards to find any gridElements.infoWithStyle.restaurants
    const cards = json?.data?.cards;
    if (Array.isArray(cards)) {
      for (const c of cards) {
        const arr = c?.card?.card?.gridElements?.infoWithStyle?.restaurants;
        if (Array.isArray(arr) && arr.length) return arr;
      }
    }

    // Deep search for an array of objects that look like restaurant infos
    try {
      let found = null;
      (function dfs(node) {
        if (found) return;
        if (Array.isArray(node)) {
          if (
            node.length &&
            typeof node[0] === "object" &&
            node[0]?.info?.name
          ) {
            found = node;
            return;
          }
          for (const item of node) dfs(item);
        } else if (node && typeof node === "object") {
          for (const k of Object.keys(node)) dfs(node[k]);
        }
      })(json);
      if (Array.isArray(found)) return found;
    } catch {}
    return null;
  }

  const online = useOnline();

  if (!online) {
    return <h1>You are Offline, check your Internet Connection </h1>;
  }

  if (!allRestaurants) {
    return null;
  }

  // Debounced client-side search filtering for smoother UX
  useEffect(() => {
    const handle = setTimeout(() => {
      if (!searchText) {
        setfilteredRestaurants(allRestaurants);
      } else {
        setfilteredRestaurants(filterData(searchText, allRestaurants));
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [searchText, allRestaurants]);

  return allRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <>
      <div className="p-5 bg-orange-100 my-4 flex items-center gap-2 flex-wrap">
        <input
          type="text"
          className="w-72 rounded-md border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white p-2"
          placeholder="search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <button
          className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-md"
          onClick={() => {
            const data = filterData(searchText, allRestaurants);
            setfilteredRestaurants(data);
          }}
        >
          Search
        </button>
        {searchText && (
          <button
            className="p-2 text-orange-700 hover:text-orange-900"
            onClick={() => setSearchText("")}
          >
            Clear
          </button>
        )}
      </div>
      {filteredRestaurants.length === 0 && searchText ? (
        <div className="p-8 text-center text-gray-700">
          <p className="text-lg">No restaurants match your search.</p>
          <button
            className="mt-3 px-3 py-2 bg-orange-600 text-white rounded-md"
            onClick={() => setSearchText("")}
          >
            Reset Search
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap bg-[#FFF8E1]">
        {filteredRestaurants.map((restaurant) => (
          <Link
            key={restaurant.info.id}
            to={"/restaurant/" + restaurant.info.id}
          >
            <RestrauntCard
              restaurantData={restaurant}
              isFavorite={favoriteIds.has(String(restaurant.info.id))}
              onToggleFavorite={async (data) => {
                if (!isLoggedIn()) {
                  const next = `${location.pathname}${location.search}`;
                  navigate(`/login?next=${encodeURIComponent(next)}`);
                  return;
                }
                const id = String(data?.info?.id);
                if (!id) return;
                const next = new Set(favoriteIds);
                if (next.has(id)) {
                  next.delete(id);
                  setFavoriteIds(next);
                  await removeFavorite(id);
                } else {
                  next.add(id);
                  setFavoriteIds(next);
                  await addFavorite(id, {
                    name: data?.info?.name,
                    cuisines: data?.info?.cuisines,
                    cloudinaryImageId: data?.info?.cloudinaryImageId,
                  });
                }
              }}
            />
          </Link>
        ))}
      </div>
    </>
  );
};
export default Body;
