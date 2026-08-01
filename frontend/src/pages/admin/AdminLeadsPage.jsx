import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useLeads } from "@/hooks/useLeads";
import { STATUSES } from "@/services/leadStatus";

const STATUS_STYLES = {
  NEW:            "bg-blue-100 text-blue-700",
  INTERESTED:     "bg-purple-100 text-purple-700",
  CONTACTED:      "bg-green-100 text-green-700",
  FOLLOW_UP:      "bg-yellow-100 text-yellow-700",
  NOT_INTERESTED: "bg-red-100 text-red-700",
  CLOSED:         "bg-gray-100 text-gray-500",
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status?.replace("_", " ") ?? "NEW"}
    </span>
  );
}

export default function AdminLeadsPage() {
  const { leads, allLeads, loading, busyId, mark, remove, filterStatus, setFilterStatus } = useLeads();

  const counts = ["ALL", ...STATUSES].reduce((acc, s) => {
    acc[s] = s === "ALL" ? allLeads.length : allLeads.filter((l) => l.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <p className="text-xs tracking-[0.24em] text-muted uppercase">Admin</p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">Leads</h1>
      <p className="mt-2 text-sm text-muted">Incoming contacts from the website contact form.</p>

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
              filterStatus === s
                ? "bg-ink text-surface border-ink"
                : "border-line text-muted hover:text-ink",
            ].join(" ")}
          >
            {s.replace("_", " ")}
            <span className="ml-1.5 opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
        <div className="grid grid-cols-[1.1fr_1fr_1fr_80px] gap-0 border-b border-line bg-surface-2 px-4 py-3 text-xs tracking-[0.18em] uppercase text-muted">
          <div>Name</div>
          <div>Contact</div>
          <div>Status</div>
          <div />
        </div>

        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1.1fr_1fr_1fr_80px] items-center gap-4 px-4 py-4 border-b border-line">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}

        {!loading && !leads.length && (
          <div className="px-4 py-10 text-center text-muted">
            {filterStatus === "ALL" ? "No leads yet." : `No leads with status "${filterStatus.replace("_", " ")}".`}
          </div>
        )}

        {!loading && leads.map((l) => (
          <div key={l.id} className="grid grid-cols-1 gap-3 px-4 py-4 border-b border-line md:grid-cols-[1.1fr_1fr_1fr_80px] md:items-center">
            <div>
              <p className="font-medium">{l.name}</p>
              <p className="text-xs text-muted mt-0.5 line-clamp-1">{l.message}</p>
            </div>
            <div className="text-sm text-muted">
              <div>{l.phone}</div>
              <div>{l.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={l.status} />
              <select
                value={l.status}
                onChange={(e) => mark(l.id, e.target.value)}
                className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[rgba(203,179,122,0.3)]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="flex md:justify-end">
              <Button variant="danger" size="sm" disabled={busyId === l.id} onClick={() => remove(l.id)}>
                {busyId === l.id ? "..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
