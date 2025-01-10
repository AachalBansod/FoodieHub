import { restaurantList } from "../config";
import RestrauntCard from "./RestrauntCard";
import {useState, useEffect} from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";

function filterData(searchText,restaurants){
   const filterData = restaurants.filter((restaurant)=>
   restaurant.info.name.toLowerCase()?.includes(searchText.toLowerCase())
  );
   return filterData ;
};

const Body=()=>{
    const [searchText, setSearchText] = useState("");
    const [filteredRestaurants,setfilteredRestaurants] = useState([]);
    const [allRestaurants,setallRestaurants] = useState([])
    
    useEffect(()=>{
      getRestaurants();
    }, [])

    async function getRestaurants(){
      const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.4640087729816&lng=77.02618695368315&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING")
      const json = await data.json() ;
      console.log(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      setallRestaurants(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      setfilteredRestaurants(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
    }

     if(!allRestaurants){
      return null;
     }
     
    //  if(filteredRestaurants.length === 0 )
    //    return <h1>No Restaurant match your Filter </h1>;
    return allRestaurants.length === 0 ? 
        (
        <Shimmer/>
        ) : (
      <>
      <div className="search-container">
        <input 
          type="text"
          className="search-box"
          placeholder="search"
          value={searchText}
          onChange={(e)=>{
            setSearchText(e.target.value);
          }}
        />
        <button className="search-btn"
        onClick={
          ()=>{
            const data = filterData(searchText,allRestaurants);
            setfilteredRestaurants(data);
          }
        }>Search</button>
      </div>
     <div className="restaurant-list">
       {
       filteredRestaurants.map((restaurant)=>{
           return(
         <Link to={"/restaurant/" +restaurant.info.id}>
          <RestrauntCard
         key={restaurant.info.id}
         restaurantData={restaurant}
         />
         </Link>
           );
      })}
     </div>
     </>
    );
   };
export default Body;   