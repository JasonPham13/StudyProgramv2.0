import { Link, useLocation } from "react-router-dom";

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={[
        "nav-btn",
        active ? "nav-btn--active" : "",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function AppShell({ children }) {
  return (
    <div className="app-bg">
      <div className="app-surface min-h-screen flex flex-col">
        <header className="sticky top-0 z-20">
          <div className="border-b border-white/10 bg-[#070b16]/70 backdrop-blur">
            <div className="container-app py-4 flex items-center justify-between">
              <Link to="/" className="brand no-underline">
                <div className="brand-dot" />
                <div className="leading-tight">
                  <div className="brand-title">Jason Pham</div>
                  <div className="brand-sub">Flashcards • React + FastAPI</div>
                </div>
              </Link>

              <nav className="flex items-center gap-2">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/subjects">Subjects</NavLink>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="container-app py-10">{children}</div>
        </main>

        <footer className="border-t border-white/10">
          <div className="container-app py-6 text-sm text-white/55 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Jason Pham</span>
            <span className="text-white/40">Built with React + FastAPI</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
