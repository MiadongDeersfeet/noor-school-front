import { apiPost } from "./api.js";
import { clearAuthSession, saveAuthSession } from "../auth/authStorage.js";

export async function refreshAuthSession() {
  const res = await apiPost("/auth/refresh");
  if (!res?.success || !res?.data?.accessToken) {
    throw new Error(res?.message || "토큰 갱신에 실패했습니다.");
  }

  saveAuthSession({
    accessToken: res.data.accessToken,
    member: {
      memberId: res.data.memberId,
      email: res.data.email,
      name: res.data.name,
      role: res.data.role,
    },
  });

  return res.data;
}

export async function logout() {
  try {
    await apiPost("/auth/logout");
  } finally {
    clearAuthSession();
  }
}
