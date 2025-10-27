import logo from "../Assets/logo.png"; 
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const Title=()=>{
    return( 
       <a  href="/">
        <img 
        className="h-20 p-2"
        alt="Logo" 
        src= {logo}/>
        </a>
    );
  };
const HeaderComponent=()=>{
    const [LoggedInUser,setLoggedInUser] = useState(false);
    const cartItems = useSelector(store=>store.cart.items) ;
 
    console.log(cartItems);
    return(
      <div className="flex justify-between bg-orange-500 shadow-lg text-white text-base font-semibold">
        <Title/>
        <div className="nav-items">
          <ul className="flex py-8 ">
            <Link to="/">
            <li className="px-2">Home</li>
            </Link>
            <Link to="/about">
            <li className="px-2">About</li>
            </Link>
            <Link to="/contact">
            <li className="px-2">Contact</li>
            </Link>
            <Link to="/instamart">
            <li className="px-2">Instamart</li>
            </Link>
            <Link to="/cart">
            <li className="px-2">Cart-{ cartItems.length} items</li>
            </Link>
          </ul>
        </div>
        {LoggedInUser ?  (
          <button onClick={()=> setLoggedInUser(false)}>Logout</button>
        ) : (
        <button onClick= {()=> setLoggedInUser(true)}>Login</button>)}  
      </div> 
    );
  };
export default HeaderComponent;
