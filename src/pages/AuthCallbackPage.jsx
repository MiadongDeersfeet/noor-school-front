import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearAuthSession, saveAuthSession } from "../auth/authStorage.js";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("처리 중...");

  const payload = useMemo(() => {
    const accessToken = searchParams.get("accessToken");
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    const memberId = searchParams.get("memberId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const role = searchParams.get("role");

    return {
      accessToken,
      error,
      message,
      member: memberId
        ? {
            memberId: Number(memberId),
            email: email ?? "",
            name: name ?? "",
            role: role ?? "",
          }
        : null,
    };
  }, [searchParams]);

  useEffect(() => {
    if (payload.error) {
      clearAuthSession();
      setStatus(payload.message || "구글 로그인에 실패했습니다.");
      return;
    }

    if (!payload.accessToken) {
      clearAuthSession();
      setStatus("로그인 토큰을 받지 못했습니다.");
      return;
    }

    saveAuthSession({
      accessToken: payload.accessToken,
      member: payload.member,
    });
    setStatus("로그인 성공! 메인 페이지로 이동합니다.");
    const timer = window.setTimeout(() => {
      navigate("/main", { replace: true });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [navigate, payload]);

  return (
    <main
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ marginBottom: "12px" }}>인증 처리</h1>
        <p>{status}</p>
      </div>
    </main>
  );
}
