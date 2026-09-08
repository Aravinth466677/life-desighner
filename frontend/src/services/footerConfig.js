// Frontend-only footer service config — persisted in localStorage.
// Each entry is created from inside the project create/edit form.
// Shape: { id, projectId, serviceLabel, slug, enabled }
// slug example: "modular-kitchen"  →  public URL: /services/modular-kitchen

const KEY = "footerServices";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); }
  catch { return []; }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getFooterServices() {
  return load();
}

export function saveFooterServices(services) {
  save(services);
}

// Upsert by projectId — called when a project is saved with footer service enabled
export function upsertFooterService({ projectId, serviceLabel, slug, enabled }) {
  const all = load();
  const existing = all.find((s) => String(s.projectId) === String(projectId));
  let next;
  if (existing) {
    next = all.map((s) =>
      String(s.projectId) === String(projectId)
        ? { ...s, serviceLabel, slug, enabled }
        : s
    );
  } else {
    next = [...all, { id: String(projectId), projectId: String(projectId), serviceLabel, slug, enabled }];
  }
  save(next);
}

// Remove by projectId — called when a project is deleted or footer service is turned off
export function removeFooterService(projectId) {
  const next = load().filter((s) => String(s.projectId) !== String(projectId));
  save(next);
}

// Get the service entry for a single project (or null)
export function getServiceForProject(projectId) {
  return load().find((s) => String(s.projectId) === String(projectId)) ?? null;
}
