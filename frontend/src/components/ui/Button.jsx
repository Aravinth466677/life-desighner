export default function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-ink text-surface hover:bg-ink/90",
    outline: "border border-line bg-transparent hover:bg-surface-2",
    ghost: "bg-transparent hover:bg-surface-2",
    gold: "bg-gold text-ink hover:bg-gold-2",
    danger: "bg-[color:var(--color-danger)] text-white hover:opacity-90",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <As
      className={[base, variants[variant], sizes[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
