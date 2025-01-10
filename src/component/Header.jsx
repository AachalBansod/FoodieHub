import logo from "../Assets/logo.png"; 
import { useState } from "react";
import { Link } from "react-router-dom";

const Title=()=>{
    return( 
       <a  href="/">
        <img 
        className="logo"
        alt="Logo" 
        src= {logo}/>
        </a>
    );
  };
const HeaderComponent=()=>{
    const [LoggedInUser,setLoggedInUser] = useState(false);
    return(
      <div className="Header">
        <Title/>
        <div className="nav-items">
          <ul>
            <Link>
            <li>Home</li>
            </Link>
            <Link to="/about">
            <li>About</li>
            </Link>
            <Link to="/contact">
            <li>Contact</li>
            </Link>
            <li>Cart</li>
            <Link to="/instamart">
            <li>Instamart</li>
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
