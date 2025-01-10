import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { IMG_CDN_URL } from "../config";
import Shimmer from "./Shimmer";
const RestrauntMenu = ()=>{
    const param  = useParams() ;
    const {id} = param ;

    const [Restaurant,setRestaurant] = useState(null);
    useEffect(()=>{
        getRestaurantInfo();
    },[]);

    async function getRestaurantInfo(){
        const data = await fetch(
            "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.4640087729816&lng=77.02618695368315&restaurantId=" + id + "&catalog_qa=undefined&submitAction=ENTER"
        );
        const json = await data.json() ;
        console.log(json.data?.cards[2].card?.card?.info);
        setRestaurant(json.data?.cards[2].card?.card?.info);
    }

  
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