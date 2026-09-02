import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        ["text-sm tracking-wide transition-colors", isActive ? "text-ink" : "text-muted hover:text-ink"].join(" ")
      }
      end
    >
      {children}
    </NavLink>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="top-0 z-40 border-b border-line"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-[44px_1fr_44px] items-center px-4 py-3 md:flex md:justify-between md:gap-6">
          <button
            type="button"
            className="md:hidden rounded-xl border border-line px-2.5 py-2 text-sm hover:bg-surface-2 transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            &equiv;
          </button>

          <Link to="/" className="mx-auto md:mx-0">
            <Logo size="xl" />
          </Link>

          <div className="flex justify-end md:hidden">
            <ThemeToggle />
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/projects">Projects</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setOpen(false)}
          onTouchStart={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
          <div className="absolute inset-x-4 top-24">
            <div
              className="mx-auto max-w-sm overflow-hidden rounded-[28px] border border-line shadow-2xl"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-surface) 42%, transparent)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Choose where to go"
            >
              <div className="border-b border-line px-5 py-4">
                <p className="font-serif text-2xl leading-tight text-ink">What brings you here?</p>
              </div>

              <div className="grid gap-3 p-3">
                <Link
                  to="/projects"
                  onClick={() => setOpen(false)}
                  className="group rounded-2xl border border-line bg-surface/55 p-4 transition-all hover:-translate-y-0.5 hover:bg-surface/75"
                >
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-semibold text-ink">
                    1
                  </span>
                  <span className="block text-base font-medium text-ink">Do you have doubt in our works?</span>
                  <span className="mt-1 block text-sm text-muted">See projects, finishes, and completed spaces.</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="group rounded-2xl border border-line bg-surface/55 p-4 transition-all hover:-translate-y-0.5 hover:bg-surface/75"
                >
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-surface">
                    2
                  </span>
                  <span className="block text-base font-medium text-ink">Do you have interest in our work?</span>
                  <span className="mt-1 block text-sm text-muted">Start a conversation about your space.</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
