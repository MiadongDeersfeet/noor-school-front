import { apiGet, apiPost } from "./api.js";

/**
 * 백엔드 QuizController + QuizServiceImpl 과 대응
 * - GET /api/quizzes/random → ResponseData&lt;QuizSetResponseDTO&gt;
 * - POST /api/quizzes/submit → QuizSubmitResponseDTO (래핑 없음)
 */

/**
 * @returns {Promise<{ totalCount: number, quizzes: Array<{
 *   wordId: number,
 *   question: string,
 *   options: string[],
 *   category: string | null,
 *   difficulty: number | null
 * }> }>}
 */
export async function fetchRandomQuizSet() {
  const res = await apiGet("/quizzes/random");
  if (res && res.success === false) {
    throw new Error(res.message || "랜덤 퀴즈를 가져오지 못했습니다.");
  }
  const data = res?.data;
  if (!data || typeof data !== "object") {
    throw new Error(res?.message || "응답 형식이 올바르지 않습니다.");
  }
  return data;
}

/**
 * @param {number} wordId
 * @param {string} selectedAnswer 한국어 보기 문자열
 */
export async function submitWordQuizAnswer(wordId, selectedAnswer) {
  return apiPost("/quizzes/submit", { wordId, selectedAnswer });
}
