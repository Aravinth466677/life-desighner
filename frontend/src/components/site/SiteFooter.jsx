import { Link } from "react-router-dom";
import Logo from "@/components/brand/Logo";
import { getFooterServices } from "@/services/footerConfig";

// Split array into columns of max `size` items each
function chunkBy(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function SiteFooter() {
  const services = getFooterServices().filter((s) => s.enabled);
  const columns = chunkBy(services, 4);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Services section — only rendered when at least one enabled service exists */}
        {services.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 text-xs tracking-[0.18em] text-muted uppercase">Services</p>
            <div className="flex flex-wrap gap-x-10 gap-y-0">
              {columns.map((col, ci) => (
                <ul key={ci} className="flex flex-col gap-1.5">
                  {col.map((svc) => (
                    <li key={svc.id}>
                      <Link
                        to={`/services/${svc.slug}`}
                        className="text-sm text-muted hover:text-ink transition-colors"
                      >
                        {svc.serviceLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        )}

        {/* Static bottom bar — always present */}
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
