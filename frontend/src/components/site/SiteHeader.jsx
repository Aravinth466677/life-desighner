import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "text-sm tracking-wide transition-colors",
          isActive ? "text-ink" : "text-muted hover:text-ink",
        ].join(" ")
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
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[44px_1fr_44px] items-center px-4 py-3 md:flex md:justify-between md:gap-6">
        <button
          type="button"
          className="md:hidden rounded-xl border border-line px-2.5 py-2 text-sm hover:bg-surface-2 transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          ≡
        </button>

        <Link to="/" className="mx-auto md:mx-0">
          <Logo size="xl" className="md:h-20" />
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="absolute left-0 top-0 h-full w-[84%] max-w-xs border-r border-line bg-surface/85 backdrop-blur-2xl shadow-2xl p-5"
              aria-label="Mobile menu"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo size="lg" />
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <NavItem to="/">Home</NavItem>
                <NavItem to="/projects">Projects</NavItem>
                <NavItem to="/contact">Contact</NavItem>
                <div className="pt-2">
                  <Button as={Link} to="/contact" variant="gold" size="lg" className="w-full">
                    Get a Quote
                  </Button>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
