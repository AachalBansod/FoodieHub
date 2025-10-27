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
import { useParams } from "react-router-dom";
import { IMG_CDN_URL } from "../config";
import Shimmer from "./Shimmer";
import useRestaurant from "../utils/useRestaurant";
import {addItem} from "../utils/cartSlice";
import { useDispatch } from "react-redux";


const RestrauntMenu = () => {
  const param = useParams();
  const { id } = param;
 
  const dispatch = useDispatch();
  const addFoodItems=(item)=>{
    dispatch(addItem(item)); 
  }
  
  const Restaurant = useRestaurant(id);

  // Find the recommended menu items
  const recommendedMenu = Restaurant?.cards?.find(
    (card) =>
      card.groupedCard?.cardGroupMap?.REGULAR?.cards?.find(
        (c) => c.card?.card?.title === "Recommended"
      )
  )?.groupedCard?.cardGroupMap?.REGULAR?.cards?.find(
    (c) => c.card?.card?.title === "Recommended"
  )?.card?.card?.itemCards;

  return !Restaurant?.cards[2].card?.card?.info ? (
    <Shimmer />
  ) : (
    <div className="flex">
      <div className=" m-2">
      <h1>Restaurant id : {id}</h1>
      <h2>{Restaurant?.cards[2].card?.card?.info.name}</h2>
      <img className="h-64 w-64"
        src={IMG_CDN_URL + Restaurant?.cards[2].card?.card?.info.cloudinaryImageId}
        alt="Restaurant"
      />
      <h2>CostForTwo: {(Restaurant?.cards[2].card?.card?.info.costForTwo) / 100}</h2>
      <h2>Rating: {Restaurant?.cards[2].card?.card?.info.avgRating}</h2>
       </div>
      {/* Render Recommended Menu */}
      <h3 >Recommended Menu</h3>
      <div>
        {recommendedMenu?.map((item, index) => (
          <div key={item.card.info.id || index} style={{ margin: "10px 0" }}>
            <h4>{item.card.info.name}</h4>
            <p>{item.card.info.description}</p>
            {item.card.info.imageId && (
              <img className="h-52 w-52"
                src={`${IMG_CDN_URL}${item.card.info.imageId}`}
                alt={item.card.info.name}
                
              />
            )}
            <p>
              <strong>Price:</strong> ₹
              {item.card.info.price / 100 || item.card.info.defaultPrice / 100}
            </p>
            <button className="bg-green-400 p-1 " onClick={()=>{
              addFoodItems(item);
            }}>Add Item</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestrauntMenu;
