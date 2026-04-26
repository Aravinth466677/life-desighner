import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { listLeads, markContacted } from "@/services/leads";

export default function AdminLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [items, setItems] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listLeads();
      setItems(res ?? []);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const mark = async (id) => {
    setBusyId(id);
    try {
      await markContacted(id);
      toast.success("Marked as contacted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update lead");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <p className="text-xs tracking-[0.24em] text-muted uppercase">
        Admin
      </p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">
        Leads
      </h1>
      <p className="mt-2 text-sm text-muted">
        Incoming contacts from the website contact form.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
        <div className="grid grid-cols-[1.1fr_1fr_120px] gap-0 border-b border-line bg-surface-2 px-4 py-3 text-xs tracking-[0.18em] uppercase text-muted">
          <div>Name</div>
          <div>Phone / Place</div>
          <div>Status</div>
        </div>

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1.1fr_1fr_120px] items-center gap-4 px-4 py-4 border-b border-line">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}

        {!loading && !items.length && (
          <div className="px-4 py-10 text-center text-muted">
            No leads yet.
          </div>
        )}

        {!loading &&
          items.map((l) => (
            <div
              key={l._id}
              className="grid grid-cols-1 gap-4 px-4 py-4 border-b border-line md:grid-cols-[1.1fr_1fr_120px] md:items-center md:gap-4"
            >
              <div className="font-medium">{l.name}</div>
              <div className="text-sm text-muted">
                <div>{l.whatsapp}</div>
                <div>{l.place}</div>
              </div>
              <div className="flex md:justify-end">
                {l.contacted ? (
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    Contacted
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === l._id}
                    onClick={() => mark(l._id)}
                  >
                    {busyId === l._id ? "..." : "Mark"}
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
