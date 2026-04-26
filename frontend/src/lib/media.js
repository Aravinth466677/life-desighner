import { FILES_BASE_URL } from "@/services/api";

export function resolveMediaUrl(input) {
  if (!input) return null;
  if (typeof input !== "string") return null;
  if (input.startsWith("data:")) return input;
  if (/^https?:\/\//i.test(input)) return input;
  if (input.startsWith("/")) return `${FILES_BASE_URL}${input}`;
  return input;
}

