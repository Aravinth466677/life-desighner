import { useTheme } from "@/app/providers/ThemeProvider";

export default function Logo({ size = "md", className = "" }) {
  const { theme } = useTheme();
  const sizes = {
    sm: "h-8",
    md: "h-11",
    lg: "h-14",
    xl: "h-16",
  };

  const src = "/logo.png";
  const wrapperClass = [
    "flex items-center gap-2 rounded-3xl border border-line p-2 shadow-soft",
    theme === "dark" ? "bg-white" : "bg-surface",
    className,
  ].join(" ");
  const imgClass = `${sizes[size] ?? sizes.md} w-auto`;
  const imgStyle =
    theme === "dark"
      ? {
          filter:
            "brightness(1.12) contrast(1.08) saturate(1.05) drop-shadow(0 10px 24px rgba(0,0,0,0.45))",
        }
      : { filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.18))" };

  return (
    <div className={wrapperClass}>
      <img
        src={src}
        alt="Life Designer"
        className={imgClass}
        style={imgStyle}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
