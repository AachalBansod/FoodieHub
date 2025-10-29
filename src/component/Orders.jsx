import { Link, useLocation } from "react-router-dom";
import { getOrders } from "../utils/orders";
import { IMG_CDN_URL } from "../config";

const Orders = () => {
  const orders = getOrders();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const placedId = params.get("orderId");

  if (!orders.length) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-[#FFF8E1] text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900">Your Orders</h1>
        <p className="mt-3 text-slate-700">No orders yet.</p>
        <Link
          to="/restaurants"
          className="inline-block mt-4 px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-50 to-[#FFF8E1]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Your Orders</h1>
        {placedId ? (
          <div className="mt-3 p-3 rounded-md bg-green-50 border border-green-200 text-green-800">
            Order placed successfully. ID: {placedId}
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-orange-100 rounded-xl shadow-sm p-4"
            >
              <div className="flex flex-wrap items-center justify-between">
                <div className="text-slate-700 text-sm">
                  <div>
                    <span className="font-medium text-slate-900">
                      Order ID:
                    </span>{" "}
                    {o.id}
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Date:</span>{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Subtotal: ₹{o.subtotal}</div>
                  <div className="text-slate-700">Tax: ₹{o.tax}</div>
                  <div className="text-lg font-bold text-slate-900">
                    Total: ₹{o.total}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {o.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-orange-100"
                  >
                    {it.imageId ? (
                      <img
                        src={`${IMG_CDN_URL}${it.imageId}`}
                        alt={it.name}
                        className="h-14 w-14 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-md bg-gray-100" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">
                        {it.name}
                      </div>
                      <div className="text-sm text-slate-700">
                        Qty: {it.quantity}
                      </div>
                    </div>
                    <div className="text-right text-slate-900 font-semibold">
                      ₹{it.price * it.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
