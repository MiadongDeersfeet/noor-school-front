import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearAuthSession, saveAuthSession } from "../auth/authStorage.js";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("처리 중...");

  const payload = useMemo(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    const isNewMember = searchParams.get("isNewMember") === "true";

    if (isNewMember) {
      return {
        isNewMember: true,
        signupToken: searchParams.get("signupToken"),
        error,
        message,
      };
    }

    const accessToken = searchParams.get("accessToken");
    const memberId = searchParams.get("memberId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const role = searchParams.get("role");

    return {
      isNewMember: false,
      accessToken,
      error,
      message,
      member: memberId
        ? { memberId: Number(memberId), email: email ?? "", name: name ?? "", role: role ?? "" }
        : null,
    };
  }, [searchParams]);

  useEffect(() => {
    if (payload.error) {
      clearAuthSession();
      setStatus(payload.message || "구글 로그인에 실패했습니다.");
      return;
    }

    // 신규 회원: signupToken만 가지고 약관 동의 페이지로 이동 (세션 저장 없음)
    if (payload.isNewMember) {
      if (!payload.signupToken) {
        clearAuthSession();
        setStatus("가입 토큰을 받지 못했습니다. 다시 시도해주세요.");
        return;
      }
      setStatus("약관 동의 페이지로 이동합니다...");
      const timer = window.setTimeout(() => {
        navigate("/terms/agree", {
          replace: true,
          state: { signupToken: payload.signupToken },
        });
      }, 400);
      return () => window.clearTimeout(timer);
    }

    // 기존 회원: 세션 저장 후 메인으로
    if (!payload.accessToken) {
      clearAuthSession();
      setStatus("로그인 토큰을 받지 못했습니다.");
      return;
    }

    saveAuthSession({ accessToken: payload.accessToken, member: payload.member });
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
