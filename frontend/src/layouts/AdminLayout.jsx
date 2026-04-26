import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "@/services/auth";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm transition-colors",
          isActive ? "bg-ink text-surface" : "text-ink/70 hover:text-ink",
        ].join(" ")
      }
      end
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();

  const onLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-surface text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-xs tracking-[0.18em] text-ink/60">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="rounded-xl border border-line px-3 py-2 text-sm hover:bg-ink hover:text-surface transition-colors"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-line bg-surface-2 p-2">
          <nav className="flex flex-row gap-2 md:flex-col">
            <NavItem to="/admin/projects">Projects</NavItem>
            <NavItem to="/admin/leads">Leads</NavItem>
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
