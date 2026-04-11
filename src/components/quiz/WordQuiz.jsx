import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getQuestionsForTopic } from "../../data/mockWordQuiz.js";
import "../../styles/word-quiz.css";

/** 보기 버튼 왼쪽에 붙는 번호 라벨 (1·2·3) */
const CHOICE_LABELS = ["1", "2", "3"];

/**
 * 단어 퀴즈 화면 (아랍어 단어 → 한국어 뜻 3지선다)
 *
 * - 어디서 쓰나요?
 *   `/words/study/:topicId` 에서 주제만 바꿔 같은 UI를 재사용합니다.
 *
 * - 데이터는 어디서 오나요?
 *   지금은 `getQuestionsForTopic(topicId)` 로 목(mock) 데이터를 가져옵니다.
 *   나중에 REST API를 쓰면 이 함수만 `fetch` 호출로 바꾸면 되고, 이 컴포넌트 구조는 그대로 두면 됩니다.
 *
 * @param {string} topicId   URL 파라미터와 같은 주제 ID (예: "daily", "travel")
 * @param {string} topicTitle 상단에 보여 줄 주제 이름 (예: "일상 회화")
 */
export default function WordQuiz({ topicId, topicTitle }) {
  // 주제가 바뀔 때만 문제 목록을 다시 계산합니다.
  const questions = useMemo(() => getQuestionsForTopic(topicId), [topicId]);
  const total = questions.length;

  // --- 퀴즈 진행 상태 ---
  /** 지금 몇 번째 문제인지 (0부터 시작) */
  const [index, setIndex] = useState(0);
  /** 사용자가 고른 보기 ID (아직 고르지 않았으면 null) */
  const [selectedId, setSelectedId] = useState(null);
  /** 한 문제에서 답을 고른 뒤에는 true → 보기를 더 누를 수 없게 막습니다 */
  const [locked, setLocked] = useState(false);
  /** 지금 세션에서 맞힌 개수 */
  const [score, setScore] = useState(0);
  /** 마지막 문제까지 끝났는지 → true면 결과 화면으로 갑니다 */
  const [sessionDone, setSessionDone] = useState(false);

  const question = questions[index];

  /** 보기 하나를 눌렀을 때: 정답이면 점수 +1, 그리고 잠금 */
  const pickChoice = useCallback(
    (choiceId) => {
      if (locked || !question) return;
      setSelectedId(choiceId);
      setLocked(true);
      if (choiceId === question.correctId) {
        setScore((s) => s + 1);
      }
    },
    [locked, question]
  );

  /** '다음 문제' / '결과 보기': 마지막이면 세션 종료, 아니면 다음 문항으로 */
  const goNext = useCallback(() => {
    if (index >= total - 1) {
      setSessionDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setLocked(false);
  }, [index, total]);

  // 문항이 하나도 없거나, 퀴즈를 모두 끝낸 경우 → 완료(결과) 화면
  if (sessionDone || total === 0) {
    const finalScore = sessionDone ? score : 0;
    const max = total || 1;
    return (
      <div className="word-quiz">
        <div className="word-quiz__top">
          <Link
            to="/words/topics"
            className="word-quiz__back"
            aria-label="주제 목록으로"
            title="주제 목록"
          >
            ←
          </Link>
          <span className="word-quiz__topic">{topicTitle}</span>
          {/* 오른쪽 진행 막대 자리 맞추기용(빈 공간) */}
          <span className="word-quiz__top-spacer" aria-hidden="true" />
        </div>
        <div className="word-quiz-complete">
          <div className="word-quiz-complete__emoji" aria-hidden="true">
            {finalScore === max ? "🌟" : finalScore >= max * 0.75 ? "🎉" : "💪"}
          </div>
          <h2 className="word-quiz-complete__title">
            {finalScore === max
              ? "완벽해요!"
              : finalScore >= max * 0.5
                ? "잘했어요!"
                : "다음엔 더 잘할 거예요!"}
          </h2>
          <p className="word-quiz-complete__score">
            {finalScore} / {max} 정답
          </p>
          <p className="word-quiz-complete__msg">
            아랍어 단어와 한국어 뜻을 연결하는 감각이 조금씩 쌓이고 있어요.
            API가 연결되면 이 화면은 같은 UI로 실제 문제만 바뀝니다.
          </p>
          <div className="word-quiz-complete__actions">
            <Link
              to="/words/topics"
              className="word-quiz-complete__btn word-quiz-complete__btn--primary"
            >
              다른 주제 풀기
            </Link>
            <Link to="/" className="word-quiz-complete__btn word-quiz-complete__btn--ghost">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 진행 막대: "지금까지 풀어 온 비율" 느낌으로 (현재 문항 번호 기준)
  const progressPct = ((index + 1) / total) * 100;
  /** 답을 고른 뒤에만 '다음' 버튼 활성화 */
  const showNext = locked;

  /**
   * 보기 버튼에 붙일 className
   * - 고르기 전: 선택 강조만
   * - 고른 뒤: 정답은 초록, 내가 고른 오답은 빨강, 나머지는 비활성 느낌
   */
  const choiceClass = (choiceId) => {
    const base = "word-quiz__choice";
    if (!locked) {
      return `${base}${selectedId === choiceId ? " word-quiz__choice--selected" : ""}`;
    }
    const isCorrect = choiceId === question.correctId;
    const isPicked = choiceId === selectedId;
    if (isCorrect) return `${base} word-quiz__choice--locked word-quiz__choice--correct`;
    if (isPicked && !isCorrect) return `${base} word-quiz__choice--locked word-quiz__choice--wrong`;
    return `${base} word-quiz__choice--locked`;
  };

  return (
    <div className="word-quiz">
      <header className="word-quiz__top">
        <Link
          to="/words/topics"
          className="word-quiz__back"
          aria-label="주제 목록으로"
        >
          ←
        </Link>
        <span className="word-quiz__topic">{topicTitle}</span>
        <div className="word-quiz__progress-wrap">
          <div className="word-quiz__progress-num">
            {index + 1} / {total}
          </div>
          <div
            className="word-quiz__progress-bar"
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={1}
            aria-valuemax={total}
          >
            <div
              className="word-quiz__progress-fill"
              style={{ width: `${Math.min(100, progressPct)}%` }}
            />
          </div>
        </div>
      </header>

      <div className="word-quiz__body">
        {/* key={question.id} → 문항이 바뀔 때 카드 애니메이션이 자연스럽게 다시 돕니다 */}
        <article className="word-quiz__card" key={question.id}>
          <p className="word-quiz__prompt">{question.prompt}</p>
          <div className="word-quiz__arabic-wrap">
            <p className="word-quiz__arabic" lang="ar" dir="rtl">
              {question.arabic}
            </p>
          </div>

          <div className="word-quiz__choices" role="group" aria-label="보기 선택">
            {question.choices.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={choiceClass(c.id)}
                onClick={() => pickChoice(c.id)}
                disabled={locked}
              >
                <span className="word-quiz__choice-num">{CHOICE_LABELS[i]}</span>
                {c.text}
              </button>
            ))}
          </div>

          {locked && (
            <div
              className={`word-quiz__feedback ${selectedId === question.correctId ? "word-quiz__feedback--ok" : "word-quiz__feedback--bad"}`}
              role="status"
            >
              {selectedId === question.correctId
                ? "정답이에요! 잘하고 있어요."
                : "아쉽네요. 초록색이 정답이에요."}
            </div>
          )}

          <div className="word-quiz__next">
            <button
              type="button"
              className="word-quiz__btn-next"
              onClick={goNext}
              disabled={!showNext}
            >
              {index >= total - 1 ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
