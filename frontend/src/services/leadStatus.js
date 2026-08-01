const STORE_KEY = "leadStatuses";

export const STATUSES = ["NEW", "INTERESTED", "CONTACTED", "FOLLOW_UP", "NOT_INTERESTED", "CLOSED"];

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}"); }
  catch { return {}; }
}

function save(map) {
  localStorage.setItem(STORE_KEY, JSON.stringify(map));
}

export function getStatus(id) {
  return load()[id] ?? "NEW";
}

export function setStatus(id, status) {
  const map = load();
  map[id] = status;
  save(map);
}

export function removeStatus(id) {
  const map = load();
  delete map[id];
  save(map);
}

// Merge statuses into a leads array
export function mergeStatuses(leads) {
  const map = load();
  return leads.map((l) => ({ ...l, status: map[l.id] ?? "NEW" }));
}
