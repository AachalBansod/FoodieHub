import { IMG_CDN_URL } from "../config";
const RestrauntCard = (props)=>{
    const {restaurantData} = props;
    const{
      cloudinaryImageId,
      name,
      areaName,
      avgRating,
      cuisines,
      costForTwo,
      deliveryTime,
    } = restaurantData?.info;
    return(
      <div className="card">
        <img src={
           IMG_CDN_URL+
           cloudinaryImageId
        }
        alt={name}></img>
        <h2>{name}</h2>
        <h4>{cuisines.join(", ").slice(0, 30)}
            {cuisines.join(", ").length > 20 ? "..." : ""}
        </h4>
       
      </div>
    )
  }
  export default RestrauntCard;