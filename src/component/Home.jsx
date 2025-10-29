import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const icons = ["🍔", "🍕", "🍣", "🥗", "🧁", "🌮"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % icons.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-gradient-to-b from-orange-50 to-[#FFF8E1]">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Crave it. Find it. Enjoy it.
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Discover restaurants around you and save your favorites. Add dishes
            to cart and build your perfect meal.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link
              to="/restaurants"
              className="px-5 py-3 rounded-md bg-orange-600 text-white hover:bg-orange-500"
            >
              Browse Restaurants
            </Link>
            <Link
              to="/favorites"
              className="px-5 py-3 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              View Favorites
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-2xl bg-white shadow-xl border border-orange-100 flex items-center justify-center overflow-hidden">
            <span
              key={i}
              className="text-7xl transition-transform duration-500 ease-out animate-pulse"
              style={{ transform: "scale(1)" }}
            >
              {icons[i]}
            </span>
            <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-orange-50/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
