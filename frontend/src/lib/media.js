export function resolveMediaUrl(input) {
  if (!input || typeof input !== "string") return null;
  if (input.startsWith("data:") || /^https?:\/\//i.test(input)) return input;
  return null;
}
