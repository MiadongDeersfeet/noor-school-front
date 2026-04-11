import { Link } from "react-router-dom";

/** 상단 내비게이션 */
export default function SiteHeader() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="누르스쿨 홈">
          누르스쿨
        </Link>
        <nav className="header-nav" aria-label="주요 메뉴">
          <a href="#guide">교육 안내</a>
          <a href="#community">커뮤니티</a>
          <a href="#pricing">요금</a>
          <a href="#support">고객센터</a>
        </nav>
        <div className="header-actions">
          <a href="#login" className="link-login">
            로그인
          </a>
          <a href="#signup" className="btn btn-header-signup">
            회원가입
          </a>
        </div>
      </div>
    </header>
  );
}
