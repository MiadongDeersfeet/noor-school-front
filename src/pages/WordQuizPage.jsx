import { useParams, Navigate } from "react-router-dom";
import WordQuiz from "../components/quiz/WordQuiz.jsx";
import { WORD_TOPIC_ITEMS } from "./WordTopicPage.jsx";

/**
 * 단어 퀴즈 페이지.
 * random 이외의 topicId는 모두 /words/study/random으로 리디렉트한다.
 */
export default function WordQuizPage() {
  const { topicId } = useParams();

  if (topicId !== "random") {
    return <Navigate to="/words/study/random" replace />;
  }

  const topic = WORD_TOPIC_ITEMS.find((t) => t.id === "random");

  return (
    <WordQuiz
      topicId="random"
      topicTitle={topic?.title ?? "اختبار عشوائي"}
      mode="api"
    />
  );
}
