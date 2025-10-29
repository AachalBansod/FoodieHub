import { Link } from "react-router-dom";

const Home = () => {
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
          <div className="h-72 w-72 sm:h-96 sm:w-96 rounded-2xl bg-white shadow-xl border border-orange-100 flex items-center justify-center">
            <span className="text-7xl">🍔</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
