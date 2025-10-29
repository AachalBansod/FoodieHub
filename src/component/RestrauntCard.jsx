import { IMG_CDN_URL } from "../config";
const RestrauntCard = (props) => {
  const { restaurantData, isFavorite, onToggleFavorite } = props;
  const { cloudinaryImageId, name, cuisines } = restaurantData?.info;
  return (
    <div className="relative h-96 w-56 p-2 m-2 shadow-sm bg-white rounded-md">
      <button
        aria-label={isFavorite ? "Unsave" : "Save"}
        className={`absolute right-2 top-2 text-xl ${
          isFavorite ? "text-red-500" : "text-gray-400"
        } hover:scale-110`}
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite && onToggleFavorite(restaurantData);
        }}
      >
        {isFavorite ? "♥" : "♡"}
      </button>
      <img src={IMG_CDN_URL + cloudinaryImageId} alt={name}></img>
      <h2 className="font-bold text-xl">{name}</h2>
      <h4>
        {cuisines.join(", ").slice(0, 30)}
        {cuisines.join(", ").length > 20 ? "..." : ""}
      </h4>
    </div>
  );
};
export default RestrauntCard;
