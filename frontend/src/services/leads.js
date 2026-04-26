import { api } from "@/services/api";

export async function submitLead(payload) {
  const res = await api.post("/contacts", payload);
  return res.data;
}

export async function listLeads() {
  const res = await api.get("/contacts");
  return res.data;
}

export async function markContacted(id) {
  const res = await api.put(`/contacts/${id}/contacted`);
  return res.data;
}
