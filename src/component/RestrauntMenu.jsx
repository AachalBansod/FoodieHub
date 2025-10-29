// import { useParams } from "react-router-dom";
// import { IMG_CDN_URL } from "../config";
// import Shimmer from "./Shimmer";
// import useRestaurant from "../utils/useRestaurant";
// const RestrauntMenu = ()=>{
//     const param  = useParams() ;
//     const {id} = param ;

//     const Restaurant = useRestaurant(id);

//     return (!Restaurant?.cards[2].card?.card?.info)?<Shimmer></Shimmer>:(
//      <div>
//         <h1>Restraunt id : {id}</h1>
//         <h2>{Restaurant?.cards[2].card?.card?.info.name}</h2>
//         <img src={IMG_CDN_URL + Restaurant?.cards[2].card?.card?.info.cloudinaryImageId}></img>
//         <h2>CostForTwo : {(Restaurant?.cards[2].card?.card?.info.costForTwo)/100}</h2>
//         <h2>Rating : {Restaurant?.cards[2].card?.card?.info.avgRating}</h2>

//      </div>
//     );
// }
// export default RestrauntMenu;
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IMG_CDN_URL } from "../config";
import { MenuSkeleton } from "./Skeletons";
import useRestaurant from "../utils/useRestaurant";
import { getDeviceId } from "../utils/device";
import { API_BASE_URL } from "../config";
import { addItem } from "../utils/cartSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { isLoggedIn } from "../utils/auth";

const RestrauntMenu = () => {
  const param = useParams();
  const { id } = param;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const addFoodItems = (item) => {
    if (!isLoggedIn()) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    dispatch(addItem(item));
  };

  const Restaurant = useRestaurant(id);

  // Record recently viewed once when Restaurant data is available
  useEffect(() => {
    if (!API_BASE_URL || !Restaurant || !id) return;
    try {
      const deviceId = getDeviceId();
      const name =
        Restaurant?.cards?.find((c) =>
          c?.card?.card?.["@type"]?.includes("presentation.food.v2.Restaurant")
        )?.card?.card?.info?.name ||
        Restaurant?.cards?.[2]?.card?.card?.info?.name ||
        "";
      fetch(`${API_BASE_URL}/api/recently-viewed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, restaurantId: id, info: { name } }),
      }).catch(() => {});
    } catch {}
  }, [API_BASE_URL, Restaurant, id]);

  // Extract restaurant info and recommended menu items, tolerating API shape changes
  const restaurantInfo =
    Restaurant?.cards?.find((c) =>
      c?.card?.card?.["@type"]?.includes("presentation.food.v2.Restaurant")
    )?.card?.card?.info || Restaurant?.cards?.[2]?.card?.card?.info;

  const regularCards =
    // sometimes groupedCard sits as an element inside cards
    Restaurant?.cards?.find((c) => c?.groupedCard)?.groupedCard?.cardGroupMap
      ?.REGULAR?.cards ||
    // sometimes groupedCard is directly under data
    Restaurant?.groupedCard?.cardGroupMap?.REGULAR?.cards ||
    // fallback: scan all cards to find any REGULAR structure
    Restaurant?.cards?.flatMap(
      (c) => c?.card?.card?.cardGroupMap?.REGULAR?.cards || []
    ) ||
    [];

  let recommendedMenu = regularCards.find(
    (c) =>
      c?.card?.card?.title === "Recommended" &&
      Array.isArray(c?.card?.card?.itemCards)
  )?.card?.card?.itemCards;

  if (!recommendedMenu || !recommendedMenu.length) {
    // fallback to first section with itemCards
    const firstSection = regularCards.find((c) =>
      Array.isArray(c?.card?.card?.itemCards)
    );
    recommendedMenu = firstSection?.card?.card?.itemCards || [];
  }

  const rupees = (p) => (p ? Math.round(p / 100) : 0);
  const truncate = (s = "", max = 140) =>
    s.length > max ? s.slice(0, max - 1) + "…" : s;

  return !restaurantInfo ? (
    <MenuSkeleton />
  ) : (
    <section className="bg-gradient-to-b from-orange-50 to-[#FFF8E1]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex gap-6 items-start">
          {restaurantInfo?.cloudinaryImageId ? (
            <img
              className="h-40 w-40 rounded-xl object-cover border border-orange-100 shadow-sm"
              src={IMG_CDN_URL + restaurantInfo?.cloudinaryImageId}
              alt={restaurantInfo?.name}
            />
          ) : null}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {restaurantInfo?.name}
            </h1>
            {Array.isArray(restaurantInfo?.cuisines) && (
              <p className="mt-1 text-slate-600">
                {restaurantInfo.cuisines.join(", ")}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 text-green-700 border border-green-200 px-2 py-1">
                ★ {restaurantInfo?.avgRating ?? "—"}
              </span>
              {restaurantInfo?.costForTwo ? (
                <span className="rounded-md bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1">
                  ₹{rupees(restaurantInfo.costForTwo)} for two
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Recommended */}
        <h3 className="mt-10 text-2xl font-bold text-slate-900">Recommended</h3>
        {/* Card grid: match shimmer layout (2 columns on desktop) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendedMenu?.map((item, index) => {
            const info = item?.card?.info || {};
            const price = rupees(info.price || info.defaultPrice);
            const isVeg = info.isVeg === 1 || info.isVeg === true;
            const ribbonText =
              info?.ribbon?.text || (info?.isBestseller ? "Bestseller" : null);
            return (
              <div
                key={info.id || index}
                className="p-5 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition flex items-start gap-4"
              >
                {/* Image */}
                {info.imageId ? (
                  <img
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover border border-orange-100"
                    src={`${IMG_CDN_URL}${info.imageId}`}
                    alt={info.name}
                  />
                ) : (
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-gray-100" />
                )}

                {/* Content */}
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isVeg !== undefined ? (
                      <span
                        className={`inline-block h-3 w-3 rounded-full border ${
                          isVeg
                            ? "bg-green-600 border-green-700"
                            : "bg-red-600 border-red-700"
                        }`}
                        aria-label={isVeg ? "Veg" : "Non-Veg"}
                        title={isVeg ? "Veg" : "Non-Veg"}
                      />
                    ) : null}
                    <h4 className="text-lg font-semibold text-slate-900 leading-snug">
                      {truncate(info.name || "", 80)}
                    </h4>
                    {ribbonText ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                        {ribbonText}
                      </span>
                    ) : null}
                  </div>

                  {info.description ? (
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-700 line-clamp-3">
                      {truncate(info.description, 260)}
                    </p>
                  ) : null}

                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-lg font-bold text-slate-900">
                      ₹{price}
                    </div>
                    <button
                      className="inline-flex items-center px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-500 text-white"
                      onClick={() => addFoodItems(item)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RestrauntMenu;
