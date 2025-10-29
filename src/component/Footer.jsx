const Footer = () => {
  return (
    <footer className="mt-10 border-t border-orange-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
        <p>
          © {new Date().getFullYear()} FoodieHub · Built with React, Express &
          Tailwind
        </p>
        <div className="flex items-center gap-4">
          <a className="hover:text-orange-700" href="/about">
            About
          </a>
          <a className="hover:text-orange-700" href="/contact">
            Contact
          </a>
          <a className="hover:text-orange-700" href="/favorites">
            Favorites
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
