const ACCESS_TOKEN_KEY = "ns_access_token";
const MEMBER_KEY = "ns_member";

export function saveAuthSession({ accessToken, member }) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (member) {
    localStorage.setItem(MEMBER_KEY, JSON.stringify(member));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(MEMBER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getMember() {
  const raw = localStorage.getItem(MEMBER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
