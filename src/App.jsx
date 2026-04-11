import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import WordTopicPage from "./pages/WordTopicPage.jsx";
import WordQuizPage from "./pages/WordQuizPage.jsx";

/**
 * 루트 레이아웃: #wrap 아래 라우트.
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
