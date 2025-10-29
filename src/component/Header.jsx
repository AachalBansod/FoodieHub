import logo from "../Assets/logo.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser, isLoggedIn, onAuthChange } from "../utils/auth";

const HeaderComponent = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const cartCount = useSelector((store) =>
    store.cart.items.reduce((sum, it) => sum + (it.quantity || 1), 0)
  );
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(isLoggedIn());
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const unsub = onAuthChange(() => {
      setAuthed(isLoggedIn());
      setUser(getUser());
    });
    return unsub;
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img className="h-10 w-10" alt="Logo" src={logo} />
            <span className="text-xl font-bold text-slate-900">FoodieHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-slate-700 font-medium">
            <Link to="/" className="hover:text-orange-600">
              Home
            </Link>
            <Link to="/restaurants" className="hover:text-orange-600">
              Restaurants
            </Link>
            <Link to="/favorites" className="hover:text-orange-600">
              Favorites
            </Link>
            <Link
              to="/orders"
              className="hover:text-orange-600 flex items-center gap-1"
            >
              <span>Orders</span>
            </Link>
            <Link to="/about" className="hover:text-orange-600">
              About
            </Link>
            <Link to="/contact" className="hover:text-orange-600">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="px-3 py-1.5 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Cart {cartCount ? `(${cartCount})` : ""}
            </Link>
            {authed ? (
              <>
                <span className="text-slate-700">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={() => {
                    clearAuth();
                    navigate("/");
                  }}
                  className="px-3 py-1.5 rounded-md text-slate-700 hover:text-orange-700"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-slate-700 hover:text-orange-700"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 rounded-md bg-orange-600 text-white hover:bg-orange-500"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default HeaderComponent;
