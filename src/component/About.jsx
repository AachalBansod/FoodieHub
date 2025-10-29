const About = () => {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-[#FFF8E1]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900">
          About FoodieHub
        </h1>
        <p className="mt-3 text-lg text-slate-700 max-w-3xl">
          FoodieHub is a modern food discovery and ordering experience. Browse
          nearby restaurants, save your favorites, add dishes to cart, and track
          your orders — all with a clean, fast UI.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          <div className="p-5 bg-white border border-orange-100 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              What you can do
            </h2>
            <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
              <li>Search restaurants and explore menus</li>
              <li>Wishlist restaurants with one tap</li>
              <li>Add dishes to cart and place orders</li>
              <li>View order history in a dedicated page</li>
            </ul>
          </div>
          <div className="p-5 bg-white border border-orange-100 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Under the hood
            </h2>
            <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
              <li>React, React Router, Redux Toolkit, Tailwind CSS</li>
              <li>Express backend with proxy + caching</li>
              <li>MongoDB persistence for auth and favorites</li>
              <li>JWT-based authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
