import { useEffect, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import "../styles/hero.css";
import "../styles/landing.css";

// Google Identity Services 스크립트(아랍어 UI 고정)
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client?hl=ar";

export default function HomePage() {
  // 버튼 렌더 실패/설정 누락 시 사용자에게 보여줄 안내 메시지
  const [googleError, setGoogleError] = useState("");
  // GIS 버튼이 준비됐는지 추적 (추후 prompt 호출 확장 대비)
  const isGoogleReadyRef = useRef(false);

  // 구글 로그인 성공 시 전달되는 ID 토큰을 받는 콜백
  function handleCredentialResponse(response) {
    const idToken = response?.credential;
    if (!idToken) {
      setGoogleError("ID 토큰을 받지 못했습니다. 다시 시도해 주세요.");
      return;
    }
    setGoogleError("");
    console.log(`Encoded JWT ID token: ${idToken}`);
  }

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleError("Google 버튼을 표시하려면 VITE_GOOGLE_CLIENT_ID 설정이 필요합니다.");
      return;
    }

    let retryTimer;
    let isCancelled = false;

    // GIS 스크립트가 로드될 때까지 짧게 재시도한 뒤 공식 버튼을 그립니다.
    const renderGoogleButton = (attempt = 0) => {
      if (isCancelled) {
        return;
      }

      if (!window.google?.accounts?.id) {
        if (attempt >= 40) {
          setGoogleError("Google 스크립트 로드에 실패했습니다. 페이지를 새로고침해 주세요.");
          return;
        }
        retryTimer = window.setTimeout(() => renderGoogleButton(attempt + 1), 150);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      const container = document.getElementById("googleSignInDiv");
      if (!container) {
        return;
      }

      container.innerHTML = "";
      window.google.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large",
        type: "standard",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        locale: "ar",
        width: 320,
      });
      isGoogleReadyRef.current = true;
      setGoogleError("");
    };

    // index.html에서 못 불러왔을 때를 대비한 안전 로딩
    if (!document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = GIS_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    renderGoogleButton();

    return () => {
      isCancelled = true;
      isGoogleReadyRef.current = false;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, []);

  return (
    // 아랍어 사용자 기준 화면 흐름을 위해 RTL 방향 사용
    <div className="landing-page" dir="rtl">
      <SiteHeader />
      <main className="landing-main" role="main" aria-labelledby="landing-title">
        <div className="landing-content">
          <h1 id="landing-title" className="landing-title">
            يا أصحابي، أنتم أيضًا تستطيعون التحدث بالكورية!
          </h1>
          <p className="landing-subtitle">ابدأ تعلم اللغة الكورية الآن</p>
          {/* 공식 GIS 버튼이 그려질 컨테이너 (버튼 자체는 Google이 렌더링) */}
          <div className="landing-google-cta">
            <div id="googleSignInDiv" className="landing-google-wrap" />
          </div>
          {googleError ? <p className="landing-google-error">{googleError}</p> : null}
          <p className="landing-policy">
            بالمتابعة، فإنك توافق على{" "}
            <a href="#" className="landing-policy-link">
              سياسة الخصوصية
            </a>
          </p>
        </div>
      </main>
      <SiteFooter />

      {/* 기존 메인 섹션은 삭제하지 않고 보존합니다. */}
      {/* <HeroSection /> */}
    </div>
  );
}
