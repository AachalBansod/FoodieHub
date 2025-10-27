import { useSelector } from "react-redux";
import FoodItemCart from "./FoodItemCart";
import { useDispatch } from "react-redux";
import { clearCart } from "../utils/cartSlice";
const Cart=()=>{ 
    const cartItems = useSelector(store=>store.cart.items);
    const dispatch = useDispatch() ;
    const HandleClearCart = ()=>{
        dispatch(clearCart()); 
    }
 return(
   <div>
      <h1 className="font-bold text-3xl ">Cart Items- {cartItems.length}</h1>
      
      <button 
      className="bg-red-600 p-2 m-2 text-white"
      onClick={
        ()=>{
            HandleClearCart();
        }}>
            Clear Cart</button>
      {/* <FoodItemCart {...cartItems[0].card.info}></FoodItemCart> */}
   </div>
 );
};
export default Cart;