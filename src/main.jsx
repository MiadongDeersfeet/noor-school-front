import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// React 앱의 시작점(entry point)입니다.
// - #root DOM에 앱을 붙이고
// - 라우팅(BrowserRouter)을 전체 앱에 적용합니다.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
