import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi.js";
import { getAccessToken, getMember } from "../auth/authStorage.js";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import MainHeaderActions from "../components/main/MainHeaderActions.jsx";
import StudyCardSection from "../components/main/StudyCardSection.jsx";
import "../styles/hero.css";
import "../styles/landing.css";
import "../styles/main-page.css";

/**
 * 로그인 사용자 전용 메인 페이지입니다.
 * - 비로그인 상태면 랜딩("/")으로 리다이렉트
 * - 공통 헤더/푸터를 재사용
 * - 헤더 좌측 액션(마이페이지/로그아웃)과 학습 카드 섹션을 표시
 */
export default function MainPage() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // localStorage 기반 세션 정보는 최초 렌더에서 한 번만 읽습니다.
  const member = useMemo(() => getMember(), []);
  const accessToken = useMemo(() => getAccessToken(), []);

  // 토큰이 없으면 보호 페이지 접근으로 간주하고 홈으로 보냅니다.
  useEffect(() => {
    if (!accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  if (!accessToken) return null;

  // 서버 로그아웃 API 호출 -> 로컬 세션 정리 -> 홈으로 이동
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  function handleMoveMyPage() {
    // 마이페이지는 다음 단계 구현 예정입니다.
    window.alert("마이페이지는 준비 중입니다.");
  }

  return (
    <div className="main-page">
      <SiteHeader
        leftActions={
          <MainHeaderActions
            onLogout={handleLogout}
            loggingOut={loggingOut}
            onMyPage={handleMoveMyPage}
          />
        }
      />
      <main className="main-page__content" aria-label="로그인 후 메인">
        <p>{member?.name ? `${member.name}님 환영합니다.` : "환영합니다."}</p>
        <StudyCardSection />
      </main>
      <SiteFooter />
    </div>
  );
}
