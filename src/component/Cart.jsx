import { useSelector, useDispatch } from "react-redux";
import { IMG_CDN_URL } from "../config";
import {
  clearCart,
  incrementItem,
  decrementItem,
  removeItem,
} from "../utils/cartSlice";
import { placeOrder } from "../utils/orders";
import { useNavigate } from "react-router-dom";

const TAX_RATE = 0.18; // 18% GST

const Cart = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
    0
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return;
    const order = await placeOrder({ items: cartItems, subtotal, tax, total });
    dispatch(clearCart());
    navigate(`/orders?orderId=${encodeURIComponent(order.id)}`);
  };

  if (!cartItems.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-[#FFF8E1]">
        <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
        <p className="mt-3 text-slate-700">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-50 to-[#FFF8E1]">
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
          {cartItems.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-orange-100 shadow-sm"
            >
              {it.imageId ? (
                <img
                  src={`${IMG_CDN_URL}${it.imageId}`}
                  alt={it.name}
                  className="h-20 w-20 rounded-lg object-cover border"
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-gray-100" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {it.name}
                  </h3>
                  <button
                    className="text-slate-500 hover:text-red-600"
                    onClick={() => dispatch(removeItem(it.id))}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center border rounded-md overflow-hidden">
                    <button
                      className="px-3 py-1 text-slate-700 hover:bg-orange-50"
                      onClick={() => dispatch(decrementItem(it.id))}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-orange-50 text-slate-900">
                      {it.quantity}
                    </span>
                    <button
                      className="px-3 py-1 text-slate-700 hover:bg-orange-50"
                      onClick={() => dispatch(incrementItem(it.id))}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-700">₹{it.price} each</div>
                    <div className="text-lg font-bold text-slate-900">
                      ₹{(it.price || 0) * (it.quantity || 1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-white rounded-xl border border-orange-100 shadow-sm p-4 h-fit">
          <h2 className="text-lg font-semibold text-slate-900">
            Order Summary
          </h2>
          <div className="mt-3 space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <button
            className="mt-4 w-full px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white"
            onClick={handlePlaceOrder}
          >
            Proceed to Payment
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
