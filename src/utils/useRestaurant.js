import { useEffect, useState } from "react";
import { fetchJsonWithFallback } from "./api";
import { LATITUDE, LONGITUDE, API_BASE_URL } from "../config";

const useRestaurant = (id) => {
   const [Restaurant, setRestaurant] = useState(null);

   useEffect(() => {
      getRestaurantInfo();
      // re-run when id changes
   }, [id]);

   async function getRestaurantInfo() {
      if (!id) return;

      let json = null;
      if (API_BASE_URL) {
         const url = `${API_BASE_URL}/api/restaurants/${encodeURIComponent(id)}?lat=${encodeURIComponent(
            LATITUDE
         )}&lng=${encodeURIComponent(LONGITUDE)}`;
         json = await fetchJsonWithFallback(url);
      }
      if (!json) {
         // New Swiggy menu API (mapi) fallback for local dev w/o backend
         const baseUrl =
            "https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=" +
            encodeURIComponent(LATITUDE) +
            "&lng=" +
            encodeURIComponent(LONGITUDE) +
            "&restaurantId=" +
            encodeURIComponent(id) +
            "&submitAction=ENTER";
         json = await fetchJsonWithFallback(baseUrl);
      }

      if (json?.data) {
         setRestaurant(json.data);
      } else {
         // Keep state as null so the component can show the shimmer instead of crashing
         setRestaurant(null);
      }
   }

   return Restaurant;
};
export default useRestaurant;