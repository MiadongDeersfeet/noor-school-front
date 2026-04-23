/**
 * 로그인 후 메인 헤더 좌측 액션 영역입니다.
 * - 마이페이지 이동 버튼
 * - 로그아웃 버튼(처리 중 disabled)
 */
export default function MainHeaderActions({ onLogout, loggingOut, onMyPage }) {
  return (
    <div className="main-header-actions">
      <button type="button" className="main-header-actions__btn" onClick={onMyPage}>
        마이페이지
      </button>
      <button
        type="button"
        className="main-header-actions__btn main-header-actions__btn--danger"
        onClick={onLogout}
        disabled={loggingOut}
      >
        {loggingOut ? "로그아웃 중..." : "로그아웃"}
      </button>
    </div>
  );
}
