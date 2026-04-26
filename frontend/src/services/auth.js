const TOKEN_KEY = "adminToken";

export function getAdminToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token && token.length > 10 ? token : null;
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
}

