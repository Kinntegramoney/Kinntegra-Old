// Kinntegra API client (new React rewrite -> FastAPI /api/v2 -> Azure SQL)
const TOKEN_KEY = "kinn_token";
const USER_KEY = "kinn_user";

export function setSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}
export function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}
export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

async function postJson(path, body) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("Request failed (" + r.status + ")");
  return r.json();
}

async function getJson(path) {
  const r = await fetch(path, { headers: { "x-access-token": getToken() } });
  if (r.status === 401 || r.status === 403) {
    clearSession();
    throw new Error("unauthorized");
  }
  if (!r.ok) throw new Error("Request failed (" + r.status + ")");
  return r.json();
}

export const api = {
  login: (UserName, Password) => postJson("/api/v2/auth/login", { UserName, Password }),
  verifyPin: (Token, Pin) => postJson("/api/v2/auth/verify-pin", { Token, Pin }),
  clientCount: () => getJson("/api/v2/dashboard/clientcount"),
  clientChart: () => getJson("/api/v2/dashboard/clientchart"),
  tradeLogStatus: () => getJson("/api/v2/dashboard/tradelogstatus"),
};
