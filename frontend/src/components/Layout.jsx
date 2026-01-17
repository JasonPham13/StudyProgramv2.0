import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={[
        "px-3 py-2 rounded-lg text-sm font-medium transition",
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-700 hover:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </Link>
  );
};

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-gray-900">
            Flashcards
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/subjects">Subjects</NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-gray-600">{subtitle}</p>
          ) : null}
        </div>

        {children}
      </main>
    </div>
  );
}
