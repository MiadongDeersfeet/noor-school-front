import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import WordQuizPage from "./pages/WordQuizPage.jsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import TermsAgreementPage from "./pages/TermsAgreementPage.jsx";
import WordTopicPage from "./pages/WordTopicPage.jsx";

/**
 * 앱의 라우팅 허브입니다.
 * - "/"                 : 랜딩(홈)
 * - "/auth/callback"    : 구글 로그인 콜백
 * - "/terms/agree"      : 신규 회원 약관 동의
 * - "/main"             : 로그인 사용자 메인
 * - "/words/topics"     : 단어 주제 목록
 * - "/words/study/:id"  : 주제별 퀴즈
 */
export default function App() {
  return (
    <div id="wrap">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/terms/agree" element={<TermsAgreementPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/words/topics" element={<WordTopicPage />} />
        <Route path="/words/study/:topicId" element={<WordQuizPage />} />
      </Routes>
    </div>
  );
}
