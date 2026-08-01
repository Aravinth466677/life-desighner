import { publicApi, adminApi } from "@/services/api";

export async function submitLead(payload) {
  const res = await publicApi.post("/contact", payload);
  return res.data;
}

export async function listLeads() {
  const res = await adminApi.get("/contact");
  return Array.isArray(res.data) ? res.data : [];
}

export async function deleteLead(id) {
  const res = await adminApi.delete(`/contact/${id}`);
  return res.data;
}
