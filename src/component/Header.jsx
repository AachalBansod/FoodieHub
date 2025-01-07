import logo from "../../Assets/logo.png";
import { useState } from "react";

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
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Cart</li>
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
