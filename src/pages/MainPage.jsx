import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi.js";
import { getAccessToken, getMember } from "../auth/authStorage.js";

export default function MainPage() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const member = useMemo(() => getMember(), []);
  const accessToken = useMemo(() => getAccessToken(), []);

  useEffect(() => {
    if (!accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  if (!accessToken) return null;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "680px",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          background: "#fff",
          padding: "24px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>로그인 메인</h1>
        <p style={{ color: "#4b5563" }}>
          환영합니다{member?.name ? `, ${member.name}` : ""}.
        </p>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          이메일: {member?.email || "-"} / 권한: {member?.role || "-"}
        </p>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
          <Link
            to="/words/topics"
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              textDecoration: "none",
              color: "#111827",
            }}
          >
            단어 학습 시작
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ef4444",
              background: "#fff",
              color: "#ef4444",
              cursor: "pointer",
            }}
          >
            {loggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      </section>
    </main>
  );
}
