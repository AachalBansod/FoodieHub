import { useEffect, useState } from "react";
import { fetchFavorites } from "../utils/favorites";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RestrauntCard from "./RestrauntCard";
import { CardSkeleton } from "./Skeletons";
import { isLoggedIn } from "../utils/auth";

const Favorites = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    (async () => {
      if (!isLoggedIn()) {
        const next = `${location.pathname}${location.search}`;
        navigate(`/login?next=${encodeURIComponent(next)}`);
        return;
      }
      const data = await fetchFavorites();
      setItems(data.items || []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 bg-[#FFF8E1]">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-10 text-center bg-[#FFF8E1]">
        <p className="text-lg text-slate-700">No favorites yet.</p>
        <Link
          to="/restaurants"
          className="inline-block mt-4 px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap bg-[#FFF8E1] p-2">
      {items.map((it) => (
        <Link key={it.restaurantId} to={`/restaurant/${it.restaurantId}`}>
          <RestrauntCard
            restaurantData={{
              info: {
                id: it.restaurantId,
                name: it?.info?.name || "Restaurant",
                cuisines: it?.info?.cuisines || [],
                cloudinaryImageId: it?.info?.cloudinaryImageId || "",
              },
            }}
            isFavorite={true}
          />
        </Link>
      ))}
    </div>
  );
};

export default Favorites;
