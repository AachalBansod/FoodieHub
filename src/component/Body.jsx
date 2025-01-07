import { restaurantList } from "../config";
import RestrauntCard from "./RestrauntCard";
import {useState} from "react";

function filterData(searchText,restaurants){
   const filterData = restaurants.filter((restaurant)=>
   restaurant.info.name.includes(searchText)
  );
   return filterData ;
};
const Body=()=>{
    const [searchText, setSearchText] = useState("");
    const [restaurants,setRestaurants] = useState(restaurantList)
    return(
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
            const data = filterData(searchText,restaurants);
            setRestaurants(data);
          }
        }>Search</button>
      </div>
     <div className="restaurant-list">
       {restaurants.map((restaurant)=>(
         <RestrauntCard
         key={restaurant.info.id}
         restaurantData={restaurant}
         />
       ))}
     </div>
     </>
    );
   };
export default Body;   