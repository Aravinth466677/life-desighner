const TOKEN_KEY = "adminToken";

export function getAdminToken() {
  const token = localStorage.getItem(TOKEN_KEY)?.trim();
  return token && token.length > 10 ? token : null;
}

export function setAdminToken(token) {
  if (token && typeof token === "string") localStorage.setItem(TOKEN_KEY, token.trim());
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
}
