const Contact = () => {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-[#FFF8E1]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact</h1>
        <p className="mt-2 text-slate-700 max-w-3xl">
          Have a question, feature request, or collaboration idea? Reach out to
          the developers behind FoodieHub.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          <div className="p-5 bg-white border border-orange-100 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Aachal Bansod
            </h2>
            <p className="mt-1 text-slate-700">Full‑stack developer</p>
            <a
              href="mailto:aachalbansod002@gmail.com"
              className="mt-3 inline-block px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500"
            >
              aachalbansod002@gmail.com
            </a>
          </div>
          <div className="p-5 bg-white border border-orange-100 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Aniket Bansod
            </h2>
            <p className="mt-1 text-slate-700">Full‑stack developer</p>
            <a
              href="mailto:aniketbansod2004@gmail.com"
              className="mt-3 inline-block px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500"
            >
              aniketbansod2004@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-8 p-5 bg-white border border-orange-100 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            General inquiries
          </h2>
          <p className="mt-2 text-slate-700">
            Email us anytime and we’ll get back to you shortly.
          </p>
          <a
            href="mailto:foodiehub@gmail.com"
            className="mt-3 inline-block px-4 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            foodiehub@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};
export default Contact;
