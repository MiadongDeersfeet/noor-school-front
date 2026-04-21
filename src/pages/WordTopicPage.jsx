import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import "../styles/word-topic-page.css";

/** 단어 학습 주제 — `random` 은 백엔드 GET /api/quizzes/random 과 연동 */
export const WORD_TOPIC_ITEMS = [
  {
    id: "random",
    title: "랜덤 퀴즈",
    hint: "전체 단어에서 무작위 출제 · 서버 연동",
  },
  { id: "daily", title: "일상 회화", hint: "인사·취미·하루 일과" },
  { id: "travel", title: "여행", hint: "공항·숙소·길 찾기" },
  { id: "food", title: "음식", hint: "메뉴·주문·맛 표현" },
  { id: "business", title: "업무·비즈니스", hint: "이메일·회의·자기소개" },
  { id: "emotion", title: "감정·표현", hint: "기분·의견·공감" },
  { id: "culture", title: "문화·관습", hint: "명절·예절·생활" },
  { id: "numbers", title: "숫자·시간", hint: "날짜·시각·가격" },
  { id: "basic", title: "기초 어휘", hint: "필수 단어·문장 패턴" },
];

export default function WordTopicPage() {
  return (
    <>
      <SiteHeader />
      {/* 주제 카드 목록: 선택한 주제로 퀴즈 페이지로 이동 */}
      <main className="word-topic-page" aria-labelledby="word-topic-heading">
        <div className="word-topic-page__inner">
          {/* 간단한 위치 표시(브레드크럼) */}
          <p className="word-topic-page__crumb">
            <Link to="/">홈</Link>
            <span aria-hidden="true"> / </span>
            <span>단어</span>
            <span aria-hidden="true"> / </span>
            <span className="word-topic-page__crumb-current">주제 선택</span>
          </p>
          <h1 id="word-topic-heading" className="word-topic-page__title">
            학습할 단어 주제를 선택하세요
          </h1>
          <p className="word-topic-page__lead">
            카테고리별로 어휘를 나누어 두었습니다. 주제를 누르면 아랍어 단어 퀴즈(3지선다)로
            이동합니다.
          </p>

          <ul className="word-topic-grid" role="list">
            {WORD_TOPIC_ITEMS.map(({ id, title, hint }) => (
              <li key={id} className="word-topic-grid__cell" role="listitem">
                {/* topic id를 URL에 넣어 공통 퀴즈 컴포넌트를 재사용 */}
                <Link
                  to={`/words/study/${id}`}
                  className={
                    id === "random"
                      ? "word-topic-card word-topic-card--random"
                      : "word-topic-card"
                  }
                >
                  <span className="word-topic-card__title">{title}</span>
                  <span className="word-topic-card__hint">{hint}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
