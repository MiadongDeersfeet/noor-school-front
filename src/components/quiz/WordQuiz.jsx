import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getQuestionsForTopic } from "../../data/mockWordQuiz.js";
import {
  fetchRandomQuizSet,
  submitWordQuizAnswer,
} from "../../api/wordQuizApi.js";
import "../../styles/word-quiz.css";

/** 보기 버튼 왼쪽에 붙는 번호 라벨 (1·2·3) */
const CHOICE_LABELS = ["1", "2", "3"];

/**
 * API 랜덤 퀴즈 한 문항을 UI용 형태로 변환합니다.
 * @param {object} q
 */
function mapQuizDtoToQuestion(q) {
  const choices = (q.options ?? []).map((text, i) => ({
    id: String(i),
    text,
  }));
  return {
    id: String(q.wordId),
    wordId: q.wordId,
    arabic: q.question,
    prompt: "이 아랍어에 맞는 한국어는?",
    choices,
    correctAudioUrl: q.correctAudioUrl ?? null,
  };
}

/**
 * 단어 퀴즈 화면 (아랍어 단어 → 한국어 뜻 3지선다)
 *
 * @param {string} topicId   URL 파라미터와 같은 주제 ID (예: "daily", "random")
 * @param {string} topicTitle 상단에 보여 줄 주제 이름
 * @param {"mock" | "api"} mode mock: 목 데이터, api: GET /quizzes/random + POST /quizzes/submit
 */
export default function WordQuiz({ topicId, topicTitle, mode = "mock" }) {
  const mockQuestions = useMemo(
    () => (mode === "mock" ? getQuestionsForTopic(topicId) : []),
    [mode, topicId]
  );

  const [apiQuestions, setApiQuestions] = useState([]);
  const [loadState, setLoadState] = useState(
    mode === "api" ? "loading" : "idle"
  );
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (mode !== "api") {
      setApiQuestions([]);
      setLoadState("idle");
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoadState("loading");
    setLoadError(null);

    (async () => {
      try {
        const dto = await fetchRandomQuizSet();
        if (cancelled) return;
        const mapped = (dto.quizzes ?? []).map(mapQuizDtoToQuestion);
        if (!mapped.length) {
          setLoadState("error");
          setLoadError("출제할 단어가 없습니다.");
          setApiQuestions([]);
          return;
        }
        setApiQuestions(mapped);
        setLoadState("idle");
      } catch (e) {
        if (!cancelled) {
          setLoadState("error");
          setLoadError(e instanceof Error ? e.message : "퀴즈를 불러오지 못했습니다.");
          setApiQuestions([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, topicId]);

  const questions = mode === "api" ? apiQuestions : mockQuestions;
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  /** api 모드: 채점 API 응답 */
  const [submitResult, setSubmitResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const question = questions[index];

  const audioRef = useRef(null);

  const playCorrectAudio = useCallback((audioUrl) => {
    if (!audioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play().catch((err) => {
      console.warn("오디오 재생 실패:", err);
    });
  }, []);

  const resetQuestionUi = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setSelectedId(null);
    setLocked(false);
    setSubmitResult(null);
    setSubmitError(null);
  }, []);

  const pickChoiceMock = useCallback(
    (choiceId) => {
      if (locked || !question) return;
      setSelectedId(choiceId);
      setLocked(true);
      if (choiceId === question.correctId) {
        setScore((s) => s + 1);
      }
      playCorrectAudio(question.correctAudioUrl);
    },
    [locked, question, playCorrectAudio]
  );

  const pickChoiceApi = useCallback(
    async (choiceId) => {
      if (locked || submitting || !question || !question.wordId) return;
      const choice = question.choices.find((c) => c.id === choiceId);
      if (!choice) return;

      setSubmitError(null);
      setSubmitting(true);
      setSelectedId(choiceId);

      try {
        const result = await submitWordQuizAnswer(
          question.wordId,
          choice.text
        );
        setSubmitResult(result);
        setLocked(true);
        if (result.correct) {
          setScore((s) => s + 1);
        }
        playCorrectAudio(question.correctAudioUrl);
      } catch (e) {
        setSelectedId(null);
        setSubmitError(
          e instanceof Error ? e.message : "채점 요청에 실패했습니다."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [locked, submitting, question, playCorrectAudio]
  );

  const pickChoice = useCallback(
    (choiceId) => {
      if (mode === "api") {
        void pickChoiceApi(choiceId);
        return;
      }
      pickChoiceMock(choiceId);
    },
    [mode, pickChoiceApi, pickChoiceMock]
  );

  const goNext = useCallback(() => {
    if (index >= total - 1) {
      setSessionDone(true);
      return;
    }
    setIndex((i) => i + 1);
    resetQuestionUi();
  }, [index, total, resetQuestionUi]);

  const retryLoad = useCallback(() => {
    setLoadState("loading");
    setLoadError(null);
    (async () => {
      try {
        const dto = await fetchRandomQuizSet();
        const mapped = (dto.quizzes ?? []).map(mapQuizDtoToQuestion);
        if (!mapped.length) {
          setLoadState("error");
          setLoadError("출제할 단어가 없습니다.");
          setApiQuestions([]);
          return;
        }
        setApiQuestions(mapped);
        setLoadState("idle");
        setIndex(0);
        setScore(0);
        setSessionDone(false);
        resetQuestionUi();
      } catch (e) {
        setLoadState("error");
        setLoadError(
          e instanceof Error ? e.message : "퀴즈를 불러오지 못했습니다."
        );
      }
    })();
  }, [resetQuestionUi]);

  /** 완료 화면에서: API는 새 세트 요청, mock 은 같은 문항으로 세션만 리셋 */
  const restartMockSession = useCallback(() => {
    setIndex(0);
    setScore(0);
    setSessionDone(false);
    resetQuestionUi();
  }, [resetQuestionUi]);

  const handleRequestNewQuiz = useCallback(() => {
    if (mode === "api") {
      retryLoad();
    } else {
      restartMockSession();
    }
  }, [mode, retryLoad, restartMockSession]);

  if (mode === "api" && loadState === "loading") {
    return (
      <div className="word-quiz word-quiz--loading">
        <div className="word-quiz__top">
          <Link
            to="/words/topics"
            className="word-quiz__back"
            aria-label="주제 목록으로"
          >
            ←
          </Link>
          <span className="word-quiz__topic">{topicTitle}</span>
          <span className="word-quiz__top-spacer" aria-hidden="true" />
        </div>
        <p className="word-quiz__loading-msg" role="status">
          랜덤 퀴즈를 불러오는 중…
        </p>
      </div>
    );
  }

  if (mode === "api" && loadState === "error") {
    return (
      <div className="word-quiz word-quiz--error">
        <div className="word-quiz__top">
          <Link
            to="/words/topics"
            className="word-quiz__back"
            aria-label="주제 목록으로"
          >
            ←
          </Link>
          <span className="word-quiz__topic">{topicTitle}</span>
          <span className="word-quiz__top-spacer" aria-hidden="true" />
        </div>
        <div className="word-quiz-error">
          <p className="word-quiz-error__msg">{loadError}</p>
          <div className="word-quiz-error__actions">
            <button
              type="button"
              className="word-quiz__btn-next"
              onClick={retryLoad}
            >
              다시 시도
            </button>
            <Link to="/words/topics" className="word-quiz-error__link">
              주제 목록
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            {mode === "api"
              ? "서버에서 출제한 랜덤 단어로 연습했어요."
              : "아랍어 단어와 한국어 뜻을 연결하는 감각이 조금씩 쌓이고 있어요."}
          </p>
          <div className="word-quiz-complete__actions">
            <button
              type="button"
              className="word-quiz-complete__btn word-quiz-complete__btn--secondary"
              onClick={handleRequestNewQuiz}
            >
              {mode === "api" ? "새 랜덤 퀴즈 받기" : "이 주제 다시 풀기"}
            </button>
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

  const progressPct = ((index + 1) / total) * 100;
  const showNext =
    mode === "api" ? locked && !submitting && submitResult : locked;

  const choiceClass = (choiceId) => {
    const base = "word-quiz__choice";
    if (!locked) {
      return `${base}${selectedId === choiceId ? " word-quiz__choice--selected" : ""}`;
    }

    if (mode === "api" && submitResult) {
      const ch = question.choices.find((c) => c.id === choiceId);
      if (!ch) return base;
      const isCorrectChoice = ch.text === submitResult.correctAnswer;
      const isPicked = choiceId === selectedId;
      if (isCorrectChoice)
        return `${base} word-quiz__choice--locked word-quiz__choice--correct`;
      if (isPicked && !submitResult.correct)
        return `${base} word-quiz__choice--locked word-quiz__choice--wrong`;
      return `${base} word-quiz__choice--locked`;
    }

    const isCorrect = choiceId === question.correctId;
    const isPicked = choiceId === selectedId;
    if (isCorrect) return `${base} word-quiz__choice--locked word-quiz__choice--correct`;
    if (isPicked && !isCorrect)
      return `${base} word-quiz__choice--locked word-quiz__choice--wrong`;
    return `${base} word-quiz__choice--locked`;
  };

  const feedbackOk =
    mode === "api" && submitResult
      ? submitResult.correct
      : selectedId === question.correctId;

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
                disabled={locked || submitting}
              >
                <span className="word-quiz__choice-num">{CHOICE_LABELS[i]}</span>
                {c.text}
              </button>
            ))}
          </div>

          {submitError && (
            <p className="word-quiz__submit-err" role="alert">
              {submitError}
            </p>
          )}

          {locked && mode === "api" && submitResult && (
            <div
              className={`word-quiz__feedback ${feedbackOk ? "word-quiz__feedback--ok" : "word-quiz__feedback--bad"}`}
              role="status"
            >
              {feedbackOk
                ? "정답이에요! 잘하고 있어요."
                : `아쉽네요. 정답은 「${submitResult.correctAnswer}」이에요.`}
            </div>
          )}

          {locked && mode === "mock" && (
            <div
              className={`word-quiz__feedback ${feedbackOk ? "word-quiz__feedback--ok" : "word-quiz__feedback--bad"}`}
              role="status"
            >
              {feedbackOk
                ? "정답이에요! 잘하고 있어요."
                : "아쉽네요. 초록색이 정답이에요."}
            </div>
          )}

          {locked && question.correctAudioUrl && (
            <div className="word-quiz__audio-row">
              <button
                type="button"
                className="word-quiz__btn-audio"
                onClick={() => playCorrectAudio(question.correctAudioUrl)}
                aria-label="정답 발음 다시 듣기"
              >
                🔊 다시 듣기
              </button>
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
