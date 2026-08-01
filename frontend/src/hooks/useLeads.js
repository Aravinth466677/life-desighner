import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { listLeads, deleteLead } from "@/services/leads";
import { mergeStatuses, setStatus, removeStatus } from "@/services/leadStatus";

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await listLeads();
      setLeads(mergeStatuses(raw));
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const mark = (id, status) => {
    setStatus(id, status);
    // Update in-place without refetch
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    toast.success("Status updated");
  };

  const remove = async (id) => {
    setBusyId(id);
    try {
      await deleteLead(id);
      removeStatus(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lead deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete lead");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = filterStatus === "ALL"
    ? leads
    : leads.filter((l) => l.status === filterStatus);

  return { leads: filtered, allLeads: leads, loading, busyId, mark, remove, filterStatus, setFilterStatus };
}
