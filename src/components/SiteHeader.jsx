import { Link } from "react-router-dom";
import siteLogo from "../assets/site-logo.png";

/**
 * 공통 헤더입니다.
 * - 현재 랜딩 집중도를 위해 액션 버튼/내비게이션은 주석 상태로 보존합니다.
 * - 로고는 브랜드 링크로 홈("/")에 연결됩니다.
 */
export default function SiteHeader() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="누르스쿨 홈">
          <img src={siteLogo} alt="누르스쿨 로고" className="brand-logo" />
        </Link>
        {/*<nav className="header-nav" aria-label="주요 메뉴">
          <a href="#guide">교육 안내</a>
          <a href="#community">커뮤니티</a>
          <a href="#pricing">요금</a>
          <a href="#support">고객센터</a>
        </nav>*/}
        {/* <div className="header-actions">
          <a
            href="#login"
            className="link-login"
            aria-label="تسجيل الدخول"
          >
            تسجيل الدخول
          </a>
        </div> */}
      </div>
    </header>
  );
}
