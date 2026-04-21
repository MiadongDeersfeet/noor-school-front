import { useParams } from "react-router-dom";
import WordQuiz from "../components/quiz/WordQuiz.jsx";
import { WORD_TOPIC_ITEMS } from "./WordTopicPage.jsx";

/**
 * 주제별 단어 퀴즈 페이지입니다.
 * URL의 topicId를 읽어서 제목/문항 데이터를 고르고,
 * 공통 UI(WordQuiz)에 전달합니다.
 * - topicId가 `random`이면 API 랜덤 모드
 * - 그 외에는 기존 목(mock) 데이터 모드
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
