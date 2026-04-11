/**
 * 단어 퀴즈 목 데이터 — 추후 API로 교체.
 * 아랍어 단어 → 한국어 뜻 3지선다 형식.
 */

const Q = (id, arabic, prompt, choices, correctId) => ({
  id,
  arabic,
  prompt,
  choices,
  correctId,
});

/** 주제별 샘플 문항 (주제당 최소 4문항) */
export const MOCK_QUESTIONS_BY_TOPIC = {
  daily: [
    Q("d1", "مرحبا", "이 아랍어에 맞는 한국어는?", [
      { id: "a", text: "안녕하세요" },
      { id: "b", text: "안녕히 가세요" },
      { id: "c", text: "만나서 반가워요" },
    ], "a"),
    Q("d2", "شكرا", "뜻으로 알맞은 것은?", [
      { id: "a", text: "죄송해요" },
      { id: "b", text: "감사합니다" },
      { id: "c", text: "천만에요" },
    ], "b"),
    Q("d3", "مع السلامة", "작별 인사에 가까운 표현은?", [
      { id: "a", text: "안녕히 주무세요" },
      { id: "b", text: "안녕히 가세요" },
      { id: "c", text: "잘 지냈어요?" },
    ], "b"),
    Q("d4", "كيف حالك؟", "의미에 가장 가까운 것은?", [
      { id: "a", text: "어디 살아요?" },
      { id: "b", text: "기분이 어때요? / 잘 지냈어요?" },
      { id: "c", text: "몇 살이에요?" },
    ], "b"),
  ],
  travel: [
    Q("t1", "مطار", "이 단어의 뜻은?", [
      { id: "a", text: "기차역" },
      { id: "b", text: "공항" },
      { id: "c", text: "버스 정류장" },
    ], "b"),
    Q("t2", "فندق", "알맞은 한국어는?", [
      { id: "a", text: "호텔" },
      { id: "b", text: "펜션" },
      { id: "c", text: "게스트하우스" },
    ], "a"),
    Q("t3", "أين الحمام؟", "여행지에서 쓸 만한 의미는?", [
      { id: "a", text: "화장실이 어디예요?" },
      { id: "b", text: "택시 어디예요?" },
      { id: "c", text: "영수증 주세요" },
    ], "a"),
    Q("t4", "تذكرة", "뜻으로 맞는 것은?", [
      { id: "a", text: "여권" },
      { id: "b", text: "표 / 티켓" },
      { id: "c", text: "지도" },
    ], "b"),
  ],
  food: [
    Q("f1", "ماء", "이 단어의 뜻은?", [
      { id: "a", text: "물" },
      { id: "b", text: "우유" },
      { id: "c", text: "주스" },
    ], "a"),
    Q("f2", "قهوة", "알맞은 것은?", [
      { id: "a", text: "차" },
      { id: "b", text: "커피" },
      { id: "c", text: "탄산음료" },
    ], "b"),
    Q("f3", "الحساب من فضلك", "식당에서 쓸 말로 가까운 것은?", [
      { id: "a", text: "메뉴 주세요" },
      { id: "b", text: "계산서 주세요" },
      { id: "c", text: "자리 있어요?" },
    ], "b"),
    Q("f4", "لذيذ", "맛에 대한 표현으로 맞는 것은?", [
      { id: "a", text: "맵다" },
      { id: "b", text: "맛있다" },
      { id: "c", text: "싸다" },
    ], "b"),
  ],
  business: [
    Q("b1", "اجتماع", "업무 맥락에서의 뜻은?", [
      { id: "a", text: "회의" },
      { id: "b", text: "계약" },
      { id: "c", text: "출장" },
    ], "a"),
    Q("b2", "موعد", "가장 가까운 한국어는?", [
      { id: "a", text: "약속 / 일정" },
      { id: "b", text: "마감" },
      { id: "c", text: "급여" },
    ], "a"),
    Q("b3", "بريد إلكتروني", "의미는?", [
      { id: "a", text: "팩스" },
      { id: "b", text: "이메일" },
      { id: "c", text: "명함" },
    ], "b"),
    Q("b4", "مشروع", "뜻으로 알맞은 것은?", [
      { id: "a", text: "프로젝트" },
      { id: "b", text: "보고서" },
      { id: "c", text: "휴가" },
    ], "a"),
  ],
  emotion: [
    Q("e1", "سعيد", "감정으로 맞는 것은?", [
      { id: "a", text: "슬프다" },
      { id: "b", text: "행복하다" },
      { id: "c", text: "화나다" },
    ], "b"),
    Q("e2", "حزين", "뜻은?", [
      { id: "a", text: "기쁘다" },
      { id: "b", text: "슬프다" },
      { id: "c", text: "피곤하다" },
    ], "b"),
    Q("e3", "متعب", "알맞은 표현은?", [
      { id: "a", text: "배고프다" },
      { id: "b", text: "피곤하다" },
      { id: "c", text: "외롭다" },
    ], "b"),
    Q("e4", "أحبك", "의미에 가까운 것은?", [
      { id: "a", text: "고마워" },
      { id: "b", text: "사랑해" },
      { id: "c", text: "미안해" },
    ], "b"),
  ],
  culture: [
    Q("c1", "عيد", "문화·절기 맥락에서 가까운 것은?", [
      { id: "a", text: "명절 / 축제" },
      { id: "b", text: "일요일" },
      { id: "c", text: "생일" },
    ], "a"),
    Q("c2", "صوم", "종교·문화와 연관될 때 의미는?", [
      { id: "a", text: "금식 / 단식 기간" },
      { id: "b", text: "운동" },
      { id: "c", text: "여행" },
    ], "a"),
    Q("c3", "ضيافة", "뜻으로 맞는 것은?", [
      { id: "a", text: "환대 / 접대" },
      { id: "b", text: "청소" },
      { id: "c", text: "예절 교과서" },
    ], "a"),
    Q("c4", "عائلة", "가장 일반적인 뜻은?", [
      { id: "a", text: "가족" },
      { id: "b", text: "이웃" },
      { id: "c", text: "회사" },
    ], "a"),
  ],
  numbers: [
    Q("n1", "واحد", "숫자로 맞는 것은?", [
      { id: "a", text: "둘" },
      { id: "b", text: "하나" },
      { id: "c", text: "셋" },
    ], "b"),
    Q("n2", "خمسة", "뜻은?", [
      { id: "a", text: "세다" },
      { id: "b", text: "다섯" },
      { id: "c", text: "열" },
    ], "b"),
    Q("n3", "الساعة كم؟", "시간 물을 때 가까운 표현은?", [
      { id: "a", text: "몇 시예요?" },
      { id: "b", text: "몇 살이에요?" },
      { id: "c", text: "얼마예요?" },
    ], "a"),
    Q("n4", "اليوم", "의미는?", [
      { id: "a", text: "내일" },
      { id: "b", text: "오늘" },
      { id: "c", text: "어제" },
    ], "b"),
  ],
  basic: [
    Q("ba1", "نعم", "기초 응답으로 맞는 것은?", [
      { id: "a", text: "아니요" },
      { id: "b", text: "네" },
      { id: "c", text: "괜찮아요" },
    ], "b"),
    Q("ba2", "لا", "뜻은?", [
      { id: "a", text: "네" },
      { id: "b", text: "아니요" },
      { id: "c", text: "모르겠어요" },
    ], "b"),
    Q("ba3", "اسم", "뜻으로 알맞은 것은?", [
      { id: "a", text: "나이" },
      { id: "b", text: "이름" },
      { id: "c", text: "주소" },
    ], "b"),
    Q("ba4", "أدرس", "동작으로 가까운 것은?", [
      { id: "a", text: "공부하다" },
      { id: "b", text: "쉬다" },
      { id: "c", text: "노래하다" },
    ], "a"),
  ],
};

const FALLBACK_TOPIC = "daily";

/**
 * @param {string} topicId
 * @returns {Array<ReturnType<typeof Q>>}
 */
export function getQuestionsForTopic(topicId) {
  const list = MOCK_QUESTIONS_BY_TOPIC[topicId];
  if (list?.length) return list;
  return MOCK_QUESTIONS_BY_TOPIC[FALLBACK_TOPIC];
}
