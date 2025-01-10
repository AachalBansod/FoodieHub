import { useParams } from "react-router-dom";
import { IMG_CDN_URL } from "../config";
import Shimmer from "./Shimmer";
import useRestaurant from "../utils/useRestaurant";
const RestrauntMenu = ()=>{
    const param  = useParams() ;
    const {id} = param ;

    const Restaurant = useRestaurant(id);

    return (!Restaurant)?<Shimmer></Shimmer>:(
     <div>
        <h1>Restraunt id : {id}</h1>
        <h2>{Restaurant.name}</h2>
        <img src={IMG_CDN_URL + Restaurant.cloudinaryImageId}></img>
        <h2>CostForTwo : {(Restaurant.costForTwo)/100}</h2>
        <h2>Rating : {Restaurant.avgRating}</h2>
        
     </div>
    );
}
export default RestrauntMenu;