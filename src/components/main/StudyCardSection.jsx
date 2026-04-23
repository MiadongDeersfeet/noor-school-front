import { useNavigate } from "react-router-dom";

/**
 * 학습하기 카드 섹션입니다.
 * 카드 클릭 시 주제 선택 페이지("/words/topics")로 이동합니다.
 */
export default function StudyCardSection() {
  const navigate = useNavigate();

  function handleMoveToTopics() {
    navigate("/words/topics");
  }

  return (
    <section className="study-card-section" aria-labelledby="study-card-title">
      <h1 id="study-card-title" className="study-card-section__title">
        학습하기
      </h1>
      <button type="button" className="study-card" onClick={handleMoveToTopics}>
        <span className="study-card__arabic" lang="ar" dir="rtl">
          تعلّم المفردات
        </span>
        <span className="study-card__korean">단어 학습</span>
        <span className="study-card__hint">퀴즈 선택으로 이동</span>
      </button>
    </section>
  );
}
