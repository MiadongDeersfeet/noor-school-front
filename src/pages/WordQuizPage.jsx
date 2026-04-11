import { useParams } from "react-router-dom";
import WordQuiz from "../components/quiz/WordQuiz.jsx";
import { WORD_TOPIC_ITEMS } from "./WordTopicPage.jsx";

/**
 * 주제별 단어 퀴즈 페이지 — topicId 가 `random` 이면 API 랜덤 세트, 그 외에는 목 데이터.
 */
export default function WordQuizPage() {
  const { topicId } = useParams();
  const topic = WORD_TOPIC_ITEMS.find((t) => t.id === topicId);
  const isRandom = topicId === "random";

  return (
    <WordQuiz
      topicId={topicId ?? "daily"}
      topicTitle={topic?.title ?? "단어 퀴즈"}
      mode={isRandom ? "api" : "mock"}
    />
  );
}
