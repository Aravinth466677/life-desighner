import Logo from "@/components/brand/Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <p className="text-xs tracking-[0.14em] text-muted uppercase">
              Life Designer
            </p>
          </div>
          <p className="text-xs text-muted">
            Copyright {new Date().getFullYear()} Life Designer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
