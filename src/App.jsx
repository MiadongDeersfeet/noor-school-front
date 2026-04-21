import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import WordTopicPage from "./pages/WordTopicPage.jsx";
import WordQuizPage from "./pages/WordQuizPage.jsx";

/**
 * 앱의 라우팅 허브입니다.
 * - "/"                 : 랜딩(홈)
 * - "/words/topics"     : 단어 주제 목록
 * - "/words/study/:id"  : 주제별 퀴즈
 */
export default function App() {
  return (
    <div id="wrap">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/words/topics" element={<WordTopicPage />} />
        <Route path="/words/study/:topicId" element={<WordQuizPage />} />
      </Routes>
    </div>
  );
}
