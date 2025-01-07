import logo from "../../Assets/logo.png";

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
      </div>
    );
  };
export default HeaderComponent;
