import { useTheme } from "@/app/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-xl border border-line px-3 py-2 text-sm hover:bg-surface-2 transition-colors"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      <span className="md:hidden">{theme === "dark" ? "☀️" : "🌙"}</span>
      <span className="hidden md:inline">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

