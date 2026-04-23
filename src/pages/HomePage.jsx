import { Link } from "react-router-dom";
import { getAccessToken } from "../auth/authStorage.js";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import "../styles/hero.css";
import "../styles/landing.css";

export default function HomePage() {
  const isLoggedIn = Boolean(getAccessToken());
  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";
  const googleLoginUrl = `${backendBase.replace(/\/$/, "")}/oauth2/authorization/google`;

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
          {/* 서버 주도 OAuth2 방식: 백엔드 인증 엔드포인트로 이동 */}
          <div className="landing-google-cta">
            {isLoggedIn ? (
              <Link to="/main" className="landing-google-login-btn">
                الانتقال إلى الصفحة الرئيسية
              </Link>
            ) : (
              <a href={googleLoginUrl} className="landing-google-login-btn" aria-label="Sign in with Google">
                <span className="landing-google-login-btn__icon" aria-hidden="true">
                  <svg viewBox="0 0 18 18" width="18" height="18">
                    <path
                      fill="#EA4335"
                      d="M9 7.03v3.2h4.45c-.19 1.03-.78 1.9-1.66 2.49v2.07h2.69c1.58-1.46 2.49-3.61 2.49-6.19 0-.54-.05-1.07-.14-1.57H9z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 16.5c2.25 0 4.14-.74 5.52-2.01l-2.69-2.07c-.74.5-1.69.8-2.83.8-2.17 0-4-1.47-4.66-3.44H1.56v2.16A8.34 8.34 0 0 0 9 16.5z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M4.34 9.78A5 5 0 0 1 4.08 8.2c0-.55.09-1.09.26-1.58V4.46H1.56A8.34 8.34 0 0 0 .66 8.2c0 1.34.32 2.61.9 3.74l2.78-2.16z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M9 3.18c1.23 0 2.33.42 3.2 1.25l2.4-2.4C13.14.67 11.25-.1 9-.1A8.34 8.34 0 0 0 1.56 4.46l2.78 2.16C5 4.65 6.83 3.18 9 3.18z"
                    />
                  </svg>
                </span>
                <span className="landing-google-login-btn__text">تسجيل الدخول باستخدام Google</span>
              </a>
            )}
          </div>
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
