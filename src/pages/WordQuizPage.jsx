import { useParams } from "react-router-dom";
import WordQuiz from "../components/quiz/WordQuiz.jsx";
import { WORD_TOPIC_ITEMS } from "./WordTopicPage.jsx";

/**
 * 주제별 단어 퀴즈 페이지 — 공통 WordQuiz UI + topicId 로 목 데이터 선택.
 */
export default function WordQuizPage() {
  const { topicId } = useParams();
  const topic = WORD_TOPIC_ITEMS.find((t) => t.id === topicId);

  return (
    <WordQuiz
      topicId={topicId ?? "daily"}
      topicTitle={topic?.title ?? "단어 퀴즈"}
    />
  );
}
