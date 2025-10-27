import RestrauntCard from "./RestrauntCard";
import {useState, useEffect} from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import { filterData   } from "../utils/helper";
import useOnline from "../utils/useOnline";

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
      setallRestaurants(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      setfilteredRestaurants(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
    }

    const online = useOnline() ;

    if(!online){
      return <h1>You are Offline, check your Internet Connection </h1>
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
      <div className="p-5 bg-orange-300 my-4">
        <input 
          type="text"
          className="focus:bg-white p-2 m-2 "
          placeholder="search"
          value={searchText}
          onChange={(e)=>{
            setSearchText(e.target.value);
          }}
        />
        <button className="p-2 m-2 bg-orange-700 hover:bg-orange-500 text-white rounded-md"
        onClick={
          ()=>{
            const data = filterData(searchText,allRestaurants);
            setfilteredRestaurants(data);
          }
        }>Search</button>
      </div>
     <div className="flex flex-wrap bg-[#FFF8E1]">
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