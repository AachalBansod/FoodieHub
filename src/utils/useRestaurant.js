import { useEffect,useState } from "react";

const useRestaurant = (id) =>{
 const [Restaurant,setRestaurant] = useState(null);

 useEffect(()=>{
    getRestaurantInfo();
     },[]);

  async function getRestaurantInfo(){
     const data = await fetch(
        "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.4640087729816&lng=77.02618695368315&restaurantId=" + id + "&catalog_qa=undefined&submitAction=ENTER"
     );
     const json = await data.json() ;
     setRestaurant(json.data);
     }
     
  return Restaurant;
};
export default useRestaurant