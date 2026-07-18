export const SUPPORTED_LANGUAGES = ["en", "ko", "zh", "ru"] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: "English",
  ko: "한국어",
  zh: "中文",
  ru: "Русский",
};

export type TranslationKey =
  | "onboarding.city"
  | "onboarding.arrivalTime"
  | "onboarding.accommodation"
  | "onboarding.accommodationPlaceholder"
  | "onboarding.travelingAlone"
  | "onboarding.firstTimeInVN"
  | "onboarding.hasTransport"
  | "onboarding.hasMobileData"
  | "onboarding.yes"
  | "onboarding.no"
  | "onboarding.submit"
  | "timeline.title"
  | "timeline.loading"
  | "timeline.error"
  | "timeline.retry"
  | "timeline.openMaps"
  | "language.label";

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    "onboarding.city": "Which city are you arriving in?",
    "onboarding.arrivalTime": "What time did you arrive?",
    "onboarding.accommodation": "Where are you staying tonight?",
    "onboarding.accommodationPlaceholder": "Hotel / hostel name",
    "onboarding.travelingAlone": "Are you traveling alone?",
    "onboarding.firstTimeInVN": "Is this your first time in Vietnam?",
    "onboarding.hasTransport": "Do you already have transportation?",
    "onboarding.hasMobileData": "Do you currently have mobile data?",
    "onboarding.yes": "Yes",
    "onboarding.no": "No",
    "onboarding.submit": "Create Survival Timeline",
    "timeline.title": "Survival Timeline",
    "timeline.loading": "Preparing your first-night plan...",
    "timeline.error": "Could not reach the server. Check your connection and try again.",
    "timeline.retry": "Try again",
    "timeline.openMaps": "Open in Google Maps",
    "language.label": "Language",
  },
  ko: {
    "onboarding.city": "어느 도시에 도착하셨나요?",
    "onboarding.arrivalTime": "몇 시에 도착하셨나요?",
    "onboarding.accommodation": "오늘 밤 어디에 묵으시나요?",
    "onboarding.accommodationPlaceholder": "호텔 / 호스텔 이름",
    "onboarding.travelingAlone": "혼자 여행 중이신가요?",
    "onboarding.firstTimeInVN": "베트남이 처음이신가요?",
    "onboarding.hasTransport": "이미 이동 수단을 확보하셨나요?",
    "onboarding.hasMobileData": "현재 모바일 데이터가 있나요?",
    "onboarding.yes": "예",
    "onboarding.no": "아니요",
    "onboarding.submit": "생존 타임라인 만들기",
    "timeline.title": "서바이벌 타임라인",
    "timeline.loading": "첫날 밤 계획을 준비하고 있습니다...",
    "timeline.error": "서버에 연결할 수 없습니다. 연결 상태를 확인하고 다시 시도해 주세요.",
    "timeline.retry": "다시 시도",
    "timeline.openMaps": "구글 지도에서 열기",
    "language.label": "언어",
  },
  zh: {
    "onboarding.city": "您到达的是哪个城市?",
    "onboarding.arrivalTime": "您是几点到达的?",
    "onboarding.accommodation": "您今晚住在哪里?",
    "onboarding.accommodationPlaceholder": "酒店/青年旅舍名称",
    "onboarding.travelingAlone": "您是一个人旅行吗?",
    "onboarding.firstTimeInVN": "这是您第一次来越南吗?",
    "onboarding.hasTransport": "您已经安排好交通了吗?",
    "onboarding.hasMobileData": "您现在有移动数据吗?",
    "onboarding.yes": "是",
    "onboarding.no": "否",
    "onboarding.submit": "生成生存时间线",
    "timeline.title": "生存时间线",
    "timeline.loading": "正在为您准备第一晚的计划...",
    "timeline.error": "无法连接到服务器,请检查网络连接后重试。",
    "timeline.retry": "重试",
    "timeline.openMaps": "在谷歌地图中打开",
    "language.label": "语言",
  },
  ru: {
    "onboarding.city": "В какой город вы прибыли?",
    "onboarding.arrivalTime": "Во сколько вы прибыли?",
    "onboarding.accommodation": "Где вы остановитесь сегодня вечером?",
    "onboarding.accommodationPlaceholder": "Название отеля / хостела",
    "onboarding.travelingAlone": "Вы путешествуете одна?",
    "onboarding.firstTimeInVN": "Вы впервые во Вьетнаме?",
    "onboarding.hasTransport": "У вас уже есть транспорт?",
    "onboarding.hasMobileData": "У вас есть мобильный интернет?",
    "onboarding.yes": "Да",
    "onboarding.no": "Нет",
    "onboarding.submit": "Создать план на первую ночь",
    "timeline.title": "План на первую ночь",
    "timeline.loading": "Готовим ваш план на первую ночь...",
    "timeline.error": "Не удалось подключиться к серверу. Проверьте соединение и попробуйте снова.",
    "timeline.retry": "Повторить",
    "timeline.openMaps": "Открыть в Google Картах",
    "language.label": "Язык",
  },
};
