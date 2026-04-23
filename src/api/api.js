import axios from "axios";
import { clearAuthSession, getAccessToken, saveAuthSession } from "../auth/authStorage.js";

/**
 * REST API 호출은 모두 axios 로 통일합니다.
 *
 * - Vite: `.env` 에 `VITE_API_BASE_URL` (예: http://localhost:8080/api 또는 /api)
 * - 미설정 시 `/api` (Vite dev 서버의 proxy → Spring Boot)
 *
 * 사용 예:
 *   import { apiGet, apiPost, apiClient } from "./api/api.js";
 *   const list = await apiGet("/words/quiz/daily");
 *   await apiPost("/auth/login", { email, password });
 *   // 커스텀: await apiClient.get("/files/x", { responseType: "blob" });
 */

const DEFAULT_BASE = "/api";

export function getBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_BASE;
}

/**
 * path 가 http(s)면 절대 URL로 취급 (baseURL 결합 없이 axios 가 그대로 요청)
 * @param {string} path
 */
export function resolveUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** 공통 axios 인스턴스 — 헤더·인증 인터셉터는 여기에 추가하면 됩니다. */
export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

let refreshInFlight = null;

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config || {};
    const url = String(originalRequest.url || "");
    const isAuthEndpoint = url.includes("/auth/refresh") || url.includes("/auth/logout");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        if (!refreshInFlight) {
          refreshInFlight = apiClient
            .post("/auth/refresh")
            .then(({ data }) => {
              if (!data?.success || !data?.data?.accessToken) {
                throw new Error(data?.message || "토큰 갱신 실패");
              }
              saveAuthSession({
                accessToken: data.data.accessToken,
                member: {
                  memberId: data.data.memberId,
                  email: data.data.email,
                  name: data.data.name,
                  role: data.data.role,
                },
              });
              return data.data.accessToken;
            })
            .finally(() => {
              refreshInFlight = null;
            });
        }

        const newAccessToken = await refreshInFlight;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuthSession();
        return Promise.reject(refreshError);
      }
    }

    const ax = error.response?.data;
    const msg =
      (typeof ax?.message === "string" && ax.message) ||
      (typeof ax?.error === "string" && ax.error) ||
      error.message ||
      "요청에 실패했습니다.";
    return Promise.reject(
      error.response
        ? new Error(`${error.response.status}: ${msg}`)
        : new Error(msg)
    );
  }
);

/**
 * @param {string} path
 * @param {import("axios").AxiosRequestConfig} [config]
 */
export async function apiGet(path, config) {
  const { data } = await apiClient.get(path, config);
  return data;
}

/**
 * @param {string} path
 * @param {unknown} [body]
 * @param {import("axios").AxiosRequestConfig} [config]
 */
export async function apiPost(path, body, config) {
  const { data } = await apiClient.post(path, body, config);
  return data;
}

/**
 * @param {string} path
 * @param {unknown} [body]
 * @param {import("axios").AxiosRequestConfig} [config]
 */
export async function apiPut(path, body, config) {
  const { data } = await apiClient.put(path, body, config);
  return data;
}

/**
 * @param {string} path
 * @param {import("axios").AxiosRequestConfig} [config]
 */
export async function apiDelete(path, config) {
  const { data } = await apiClient.delete(path, config);
  return data;
}

/**
 * blob·전체 응답 헤더가 필요할 때 (파일 다운로드 등)
 * @param {string} path
 * @param {import("axios").AxiosRequestConfig} [config]
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export async function apiGetRaw(path, config) {
  return apiClient.get(path, config);
}
