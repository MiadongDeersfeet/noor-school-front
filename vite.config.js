import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Spring Boot 연동:
 * - `npm run build` → 산출물이 ../src/main/resources/static 에 생성됩니다.
 *   Boot 실행 시 루트(/)에서 React SPA가 서빙됩니다.
 * - 개발 시 `npm run dev`(기본 5173): 아래 proxy로 /api 는 8080 백엔드로 전달됩니다.
 */
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
