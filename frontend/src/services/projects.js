import { publicApi, adminApi } from "@/services/api";

// GET /api/projects → ProjectResponse[]  (no query params per spec)
export async function listProjects() {
  const res = await publicApi.get("/projects");
  return Array.isArray(res.data) ? res.data : [];
}

// GET /api/projects/{id} → ProjectResponse
export async function getProject(id) {
  const res = await publicApi.get(`/projects/${id}`);
  return res.data;
}

// POST /api/projects?title=&description=&category=&location=  + multipart heroImage
// CreateProject: query params for text fields, heroImage as multipart body
export async function createProject({ title, description, category, location, heroImage }) {
  const params = { title, description, category };
  if (location) params.location = location;

  const fd = new FormData();
  fd.append("heroImage", heroImage);

  const res = await adminApi.post("/projects", fd, { params });
  return res.data;
}

// PUT /api/projects/{id}  body: UpdateProjectRequest JSON
// { title, description, category, location, heroImage }
export async function updateProject(id, body) {
  const res = await adminApi.put(`/projects/${id}`, body);
  return res.data;
}

// DELETE /api/projects/{id}
export async function deleteProject(id) {
  const res = await adminApi.delete(`/projects/${id}`);
  return res.data;
}

// POST /api/projects/{id}/gallery  multipart images[]
export async function uploadGallery(id, files) {
  const fd = new FormData();
  for (const f of files) fd.append("images", f);
  const res = await adminApi.post(`/projects/${id}/gallery`, fd);
  return res.data;
}

// DELETE /api/projects/gallery/{imageId}  imageId is Long
export async function deleteGalleryImage(imageId) {
  const res = await adminApi.delete(`/projects/gallery/${imageId}`);
  return res.data;
}
