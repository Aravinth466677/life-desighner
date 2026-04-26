import { api } from "@/services/api";

function normalizeProjectsResponse(data) {
  if (Array.isArray(data)) {
    return {
      items: data,
      page: 1,
      pages: 1,
      total: data.length,
    };
  }
  return data;
}

export async function listProjects({
  page = 1,
  limit = 12,
  category,
  q,
} = {}) {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category && category !== "all") params.category = category;
  if (q) params.q = q;

  const res = await api.get("/projects", { params });
  return normalizeProjectsResponse(res.data);
}

export async function getProject(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}

export async function createProject(payload) {
  const res = await api.post("/projects", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateProject(id, payload) {
  const res = await api.put(`/projects/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
}

