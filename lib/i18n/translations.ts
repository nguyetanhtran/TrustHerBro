export const SUPPORTED_LANGUAGES = ["en", "ko", "zh", "ru", "vi"] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: "English",
  ko: "한국어",
  zh: "中文",
  ru: "Русский",
  vi: "Tiếng Việt",
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
  | "language.label"
  | "welcome.greeting"
  | "assistant.title"
  | "assistant.description"
  | "assistant.placeholder"
  | "assistant.warnings"
  | "assistant.travelersSay"
  | "assistant.qa1Question"
  | "assistant.qa1Answer"
  | "assistant.qa2Question"
  | "assistant.qa2Answer"
  | "scamCheck.verdictScam"
  | "scamCheck.verdictCheck"
  | "scamCheck.verdictClear"
  | "scamCheck.title"
  | "scamCheck.description"
  | "scamCheck.placeholder"
  | "scamCheck.stop"
  | "scamCheck.speak"
  | "scamCheck.checking"
  | "scamCheck.checkIt"
  | "scamCheck.transcribing"
  | "safety.welcome"
  | "safety.inputPlaceholder"
  | "safety.shareLocation"
  | "safety.shareLocationHint"
  | "safety.privacyWhat"
  | "companion.welcome"
  | "companion.fallbackReply"
  | "companion.open"
  | "companion.thinking"
  | "companion.photoAttached"
  | "companion.remove"
  | "companion.addPhoto"
  | "companion.inputPlaceholder"
  | "companion.send"
  | "safetyPage.title"
  | "safetyPage.description"
  | "emergency.title"
  | "emergency.description"
  | "emergency.sos"
  | "emergency.localNumbers"
  | "emergency.touristHotlines"
  | "emergency.showLocal"
  | "emergency.nearestHospital"
  | "emergency.embassyContact"
  | "home.entryMode"
  | "home.heroDescription"
  | "home.todosLabel"
  | "home.noTodos"
  | "home.cardFirstNight"
  | "home.cardFirstNightDesc"
  | "home.cardTimeline"
  | "home.cardTimelineDesc"
  | "home.cardSafety"
  | "home.cardSafetyDesc"
  | "home.cardAssistant"
  | "home.cardAssistantDesc"
  | "home.cardEmergency"
  | "home.cardEmergencyDesc"
  | "privacy.title"
  | "privacy.intro"
  | "privacy.sendTitle"
  | "privacy.sendWords"
  | "privacy.sendLocation"
  | "privacy.dontTitle"
  | "privacy.dontAccount"
  | "privacy.dontSell"
  | "privacy.dontTrack"
  | "privacy.controlTitle"
  | "privacy.controlNoLocation"
  | "privacy.controlSafetyOff"
  | "privacy.controlCoverDetails"
  | "privacy.disclaimer"
  | "account.logout"
  | "login.confirmationNotice"
  | "login.genericError"
  | "login.titleSignin"
  | "login.titleSignup"
  | "login.subtitle"
  | "login.emailPlaceholder"
  | "login.passwordPlaceholder"
  | "login.pleaseWait"
  | "login.signIn"
  | "login.createAccount"
  | "login.newHere"
  | "login.alreadyHaveAccount"
  | "nearby.rating"
  | "nearby.noRating"
  | "nearby.reviews"
  | "nearby.noGeoSupport"
  | "nearby.loadError"
  | "nearby.permissionDenied"
  | "nearby.locationError"
  | "nearby.title"
  | "nearby.description"
  | "nearby.finding"
  | "nearby.findButton"
  | "nearby.usingLocation"
  | "nearby.placesToEat"
  | "nearby.noFood"
  | "nearby.placesToExplore"
  | "nearby.noFun"
  | "nearby.placesConvenience"
  | "nearby.noConvenience"
  | "nearby.placesSimCard"
  | "nearby.noSimCard"
  | "translate.title"
  | "translate.description"
  | "translate.travelerToggle"
  | "translate.localToggle"
  | "translate.inputPlaceholder"
  | "translate.send"
  | "translate.sending"
  | "translate.addPhoto"
  | "translate.play"
  | "translate.historyTitle"
  | "translate.searchPlaceholder"
  | "translate.noHistory"
  | "translate.noResults";

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
    "welcome.greeting": "Welcome",
    "assistant.title": "Ask about a price, place, or person",
    "assistant.description":
      "Type a taxi fare, a hotel name, or a situation and get a trust check based on community reports and known scam warnings.",
    "assistant.placeholder": "Example: Grand Palace Hotel airport pickup",
    "assistant.warnings": "Warnings:",
    "assistant.travelersSay": "What travelers say:",
    "assistant.qa1Question": "Is this taxi price normal from the airport?",
    "assistant.qa1Answer":
      "Ask the driver to confirm meter or fixed total price before departure, then compare with a ride-hailing estimate.",
    "assistant.qa2Question": "A stranger says my hotel is closed and offers help.",
    "assistant.qa2Answer":
      "Treat it as suspicious. Verify directly with your hotel and avoid handing over your phone, bag, or booking details.",
    "scamCheck.verdictScam": "Likely a known scam",
    "scamCheck.verdictCheck": "Worth double-checking",
    "scamCheck.verdictClear": "No clear scam signal",
    "scamCheck.title": "Is this a scam?",
    "scamCheck.description":
      "Describe what's happening — speak or type, in any language. I'll check it against known scam patterns and tell you how to handle it.",
    "scamCheck.placeholder": "Example: The driver won't turn on the meter and wants a fixed price.",
    "scamCheck.stop": "Stop",
    "scamCheck.speak": "Speak",
    "scamCheck.checking": "Checking…",
    "scamCheck.checkIt": "Check it",
    "scamCheck.transcribing": "Transcribing your voice…",
    "safety.welcome":
      "I'm right here with you. Tell me what feels off — we'll sort it out together, calmly.",
    "safety.inputPlaceholder": "Or type it in your own words…",
    "safety.shareLocation": "Share my location",
    "safety.shareLocationHint": "Off by default. Turn on for a route tailored to where you are.",
    "safety.privacyWhat": "What you type here (and your location, only if shared)",
    "companion.welcome":
      "Hi, I'm your companion. Ask me anything, tap the mic to speak, or add a photo of a receipt or price board and I'll check it for you.",
    "companion.fallbackReply": "I'm here to help.",
    "companion.open": "Open",
    "companion.thinking": "Thinking…",
    "companion.photoAttached": "Photo attached",
    "companion.remove": "Remove",
    "companion.addPhoto": "Add photo",
    "companion.inputPlaceholder": "Ask me anything…",
    "companion.send": "Send",
    "safetyPage.title": "I've got you",
    "safetyPage.description":
      "Feeling uneasy? That instinct is worth trusting. I'll help you get back somewhere safe — a brighter, busier route, a trusted ride, the right words in Vietnamese, and a quiet check-in until you're okay. No alarms, just a calm plan.",
    "emergency.title": "Get help now",
    "emergency.description":
      "Big buttons, no typing required. This page works even on a weak connection - the numbers below dial directly from your phone.",
    "emergency.sos": "SOS - Call Police (113)",
    "emergency.localNumbers": "Local emergency numbers",
    "emergency.touristHotlines": "Tourist support hotlines",
    "emergency.showLocal": "Show this to a local for help",
    "emergency.nearestHospital": "Nearest hospital",
    "emergency.embassyContact": "Embassy contact",
    "home.entryMode": "Entry Mode",
    "home.heroDescription":
      "Safety-first copilot for solo female travelers. Ask a question, speak, or snap a photo of a price — I'll point you to the right mode.",
    "home.todosLabel": "Supabase Todos",
    "home.noTodos": "No todos found.",
    "home.cardFirstNight": "First Night",
    "home.cardFirstNightDesc": "7 quick questions to generate a survival timeline.",
    "home.cardTimeline": "Survival Timeline",
    "home.cardTimelineDesc": "Preview the step-by-step output format.",
    "home.cardSafety": "Safety Mode",
    "home.cardSafetyDesc": "Preventive help: safe routes, phrases, discreet mode.",
    "home.cardAssistant": "Assistant",
    "home.cardAssistantDesc": "Trust checks and voice scam detection.",
    "home.cardEmergency": "Emergency",
    "home.cardEmergencyDesc": "SOS actions and emergency contacts.",
    "privacy.title": "Your privacy",
    "privacy.intro":
      "You're often using this app tired, alone, or on edge. You shouldn't have to trade your privacy for a little help. Here's exactly what happens with your data — in plain language.",
    "privacy.sendTitle": "What we send off your device",
    "privacy.sendWords":
      "Your words (typed or spoken) go to OpenAI to generate advice. Voice is transcribed, then the audio is discarded.",
    "privacy.sendLocation":
      "Your location is only sent if you turn it on, and only to reason about a safer route nearby. It's off by default.",
    "privacy.dontTitle": "What we don't do",
    "privacy.dontAccount": "No history saved on our servers beyond what's needed to run your account.",
    "privacy.dontSell": "We don't sell data or build a profile of you.",
    "privacy.dontTrack": "We don't track your live location in the background.",
    "privacy.controlTitle": "You stay in control",
    "privacy.controlNoLocation": "Scam checks and price checks work without sharing location.",
    "privacy.controlSafetyOff": "You can use Safety Mode with location off.",
    "privacy.controlCoverDetails":
      "Before sharing a photo of a receipt, cover any personal details (name, card number, booking code) — a price check only needs the items and amounts.",
    "privacy.disclaimer":
      "This is a hackathon prototype. Advice is guidance, not a guarantee, and third-party services (OpenAI, map providers) have their own terms.",
    "account.logout": "Log out",
    "login.confirmationNotice":
      "We sent a confirmation link to your email. Confirm it, then sign in.",
    "login.genericError": "Something went wrong.",
    "login.titleSignin": "Welcome back",
    "login.titleSignup": "Create your account",
    "login.subtitle": "Your safety companion for your first hours in Vietnam.",
    "login.emailPlaceholder": "Email",
    "login.passwordPlaceholder": "Password",
    "login.pleaseWait": "Please wait…",
    "login.signIn": "Sign in",
    "login.createAccount": "Create account",
    "login.newHere": "New here?",
    "login.alreadyHaveAccount": "Already have an account?",
    "nearby.rating": "Rating",
    "nearby.noRating": "No rating yet",
    "nearby.reviews": "reviews",
    "nearby.noGeoSupport": "Your browser does not support location access.",
    "nearby.loadError": "Could not load nearby suggestions.",
    "nearby.permissionDenied":
      "Location permission was denied. Enable it to get nearby suggestions.",
    "nearby.locationError": "Could not read your location right now.",
    "nearby.title": "Nearby picks",
    "nearby.description": "Find food and fun spots around you using your current location.",
    "nearby.finding": "Finding nearby...",
    "nearby.findButton": "Find food & fun near me",
    "nearby.usingLocation": "Using location around",
    "nearby.placesToEat": "Places to eat",
    "nearby.noFood": "No nearby food suggestions found.",
    "nearby.placesToExplore": "Places to explore",
    "nearby.noFun": "No nearby activity suggestions found.",
    "nearby.placesConvenience": "Convenience stores nearby",
    "nearby.noConvenience": "No nearby convenience stores found.",
    "nearby.placesSimCard": "Buy a SIM / mobile data nearby",
    "nearby.noSimCard": "No nearby SIM card shops found.",
    "translate.title": "Two-Way Translator",
    "translate.description": "Speak or type, and I'll translate for the person in front of you — in text and out loud.",
    "translate.travelerToggle": "You speak",
    "translate.localToggle": "Local person speaks",
    "translate.inputPlaceholder": "Type or tap the mic…",
    "translate.send": "Translate",
    "translate.sending": "Translating…",
    "translate.addPhoto": "Photo",
    "translate.play": "Play",
    "translate.historyTitle": "Conversation history",
    "translate.searchPlaceholder": "Search this conversation…",
    "translate.noHistory": "No messages yet — start the conversation above.",
    "translate.noResults": "No messages match your search.",
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
    "welcome.greeting": "환영합니다",
    "assistant.title": "가격, 장소, 사람에 대해 물어보세요",
    "assistant.description":
      "택시 요금, 호텔 이름 또는 상황을 입력하면 커뮤니티 후기와 알려진 사기 경고를 바탕으로 신뢰도를 확인해 드립니다.",
    "assistant.placeholder": "예: Grand Palace Hotel 공항 픽업",
    "assistant.warnings": "경고:",
    "assistant.travelersSay": "여행자들의 의견:",
    "assistant.qa1Question": "공항에서 이 택시 요금이 정상인가요?",
    "assistant.qa1Answer":
      "출발 전에 기사에게 미터기 또는 고정 요금을 확인하도록 요청한 후, 차량 호출 앱의 예상 요금과 비교하세요.",
    "assistant.qa2Question": "낯선 사람이 제 호텔이 문을 닫았다며 도와주겠다고 합니다.",
    "assistant.qa2Answer":
      "의심스러운 상황으로 간주하세요. 호텔에 직접 확인하고 휴대폰, 가방, 예약 정보를 건네지 마세요.",
    "scamCheck.verdictScam": "알려진 사기일 가능성이 높음",
    "scamCheck.verdictCheck": "다시 확인해볼 필요가 있음",
    "scamCheck.verdictClear": "명확한 사기 신호 없음",
    "scamCheck.title": "이거 사기인가요?",
    "scamCheck.description":
      "무슨 일이 있었는지 말하거나 입력해 주세요 — 어떤 언어든 괜찮습니다. 알려진 사기 패턴과 비교하고 대처 방법을 알려드릴게요.",
    "scamCheck.placeholder": "예: 기사가 미터기를 켜지 않고 고정 요금을 요구해요.",
    "scamCheck.stop": "정지",
    "scamCheck.speak": "말하기",
    "scamCheck.checking": "확인 중…",
    "scamCheck.checkIt": "확인하기",
    "scamCheck.transcribing": "음성을 변환하는 중…",
    "safety.welcome": "제가 바로 옆에 있어요. 무엇이 이상한지 말씀해 주세요 — 차분히 함께 해결해요.",
    "safety.inputPlaceholder": "또는 직접 입력해 주세요…",
    "safety.shareLocation": "내 위치 공유",
    "safety.shareLocationHint": "기본적으로 꺼져 있습니다. 현재 위치에 맞는 경로를 원하면 켜세요.",
    "safety.privacyWhat": "여기에 입력한 내용(공유한 경우 위치 포함)",
    "companion.welcome":
      "안녕하세요, 저는 당신의 동반자입니다. 무엇이든 물어보시거나 마이크를 눌러 말씀하시거나, 영수증이나 가격표 사진을 추가하면 확인해 드릴게요.",
    "companion.fallbackReply": "도와드리기 위해 여기 있어요.",
    "companion.open": "열기",
    "companion.thinking": "생각 중…",
    "companion.photoAttached": "사진 첨부됨",
    "companion.remove": "삭제",
    "companion.addPhoto": "사진 추가",
    "companion.inputPlaceholder": "무엇이든 물어보세요…",
    "companion.send": "보내기",
    "safetyPage.title": "제가 있잖아요",
    "safetyPage.description":
      "불안하신가요? 그 직감을 믿어도 됩니다. 더 밝고 사람 많은 길, 믿을 수 있는 차량, 올바른 베트남어 표현, 그리고 괜찮아질 때까지의 조용한 확인까지 — 안전한 곳으로 돌아가도록 도와드릴게요. 경고음 없이, 차분한 계획만.",
    "emergency.title": "지금 도움 받기",
    "emergency.description":
      "큰 버튼, 입력 필요 없음. 이 페이지는 약한 연결 상태에서도 작동합니다 - 아래 번호는 휴대폰에서 바로 전화 연결됩니다.",
    "emergency.sos": "SOS - 경찰 신고 (113)",
    "emergency.localNumbers": "현지 긴급 연락처",
    "emergency.touristHotlines": "관광객 지원 핫라인",
    "emergency.showLocal": "도움을 요청할 때 현지인에게 보여주세요",
    "emergency.nearestHospital": "가장 가까운 병원",
    "emergency.embassyContact": "대사관 연락처",
    "home.entryMode": "시작 모드",
    "home.heroDescription":
      "혼자 여행하는 여성을 위한 안전 우선 동반자. 질문하거나, 말하거나, 가격표 사진을 찍으면 알맞은 모드로 안내해 드릴게요.",
    "home.todosLabel": "Supabase Todos",
    "home.noTodos": "할 일이 없습니다.",
    "home.cardFirstNight": "First Night",
    "home.cardFirstNightDesc": "7가지 간단한 질문으로 생존 타임라인을 생성합니다.",
    "home.cardTimeline": "서바이벌 타임라인",
    "home.cardTimelineDesc": "단계별 결과 형식을 미리 봅니다.",
    "home.cardSafety": "안전 모드",
    "home.cardSafetyDesc": "예방 지원: 안전 경로, 표현, 디스크릿 모드.",
    "home.cardAssistant": "어시스턴트",
    "home.cardAssistantDesc": "신뢰도 확인 및 음성 사기 감지.",
    "home.cardEmergency": "긴급 모드",
    "home.cardEmergencyDesc": "SOS 조치 및 긴급 연락처.",
    "privacy.title": "개인정보 보호",
    "privacy.intro":
      "이 앱을 지치거나, 혼자이거나, 예민한 상태에서 사용하는 경우가 많을 거예요. 약간의 도움을 받기 위해 개인정보를 희생할 필요는 없습니다. 여러분의 데이터가 정확히 어떻게 처리되는지 쉬운 말로 설명드립니다.",
    "privacy.sendTitle": "기기 밖으로 전송되는 정보",
    "privacy.sendWords":
      "입력하거나 말한 내용은 조언 생성을 위해 OpenAI로 전송됩니다. 음성은 텍스트로 변환된 후 오디오는 삭제됩니다.",
    "privacy.sendLocation":
      "위치 정보는 직접 켰을 때만 전송되며, 주변의 더 안전한 경로를 판단하는 데만 사용됩니다. 기본적으로 꺼져 있습니다.",
    "privacy.dontTitle": "하지 않는 것들",
    "privacy.dontAccount": "계정 운영에 필요한 범위를 넘어서는 기록은 서버에 저장하지 않습니다.",
    "privacy.dontSell": "데이터를 판매하거나 여러분의 프로필을 만들지 않습니다.",
    "privacy.dontTrack": "실시간 위치를 백그라운드에서 추적하지 않습니다.",
    "privacy.controlTitle": "여러분이 직접 통제합니다",
    "privacy.controlNoLocation": "사기 확인과 가격 확인은 위치 공유 없이도 작동합니다.",
    "privacy.controlSafetyOff": "위치를 끈 상태로도 안전 모드를 사용할 수 있습니다.",
    "privacy.controlCoverDetails":
      "영수증 사진을 공유하기 전에 개인정보(이름, 카드번호, 예약번호)는 가려주세요 — 가격 확인에는 항목과 금액만 필요합니다.",
    "privacy.disclaimer":
      "이것은 해커톤 프로토타입입니다. 조언은 안내일 뿐 보장이 아니며, 제3자 서비스(OpenAI, 지도 제공업체)는 자체 약관을 따릅니다.",
    "account.logout": "로그아웃",
    "login.confirmationNotice": "이메일로 확인 링크를 보냈습니다. 확인 후 로그인해 주세요.",
    "login.genericError": "문제가 발생했습니다.",
    "login.titleSignin": "다시 오신 것을 환영합니다",
    "login.titleSignup": "계정 만들기",
    "login.subtitle": "베트남에서의 첫 시간을 위한 안전 동반자입니다.",
    "login.emailPlaceholder": "이메일",
    "login.passwordPlaceholder": "비밀번호",
    "login.pleaseWait": "잠시만 기다려 주세요…",
    "login.signIn": "로그인",
    "login.createAccount": "계정 만들기",
    "login.newHere": "처음이신가요?",
    "login.alreadyHaveAccount": "이미 계정이 있으신가요?",
    "nearby.rating": "평점",
    "nearby.noRating": "평점 없음",
    "nearby.reviews": "리뷰",
    "nearby.noGeoSupport": "브라우저가 위치 접근을 지원하지 않습니다.",
    "nearby.loadError": "주변 추천을 불러올 수 없습니다.",
    "nearby.permissionDenied": "위치 권한이 거부되었습니다. 주변 추천을 받으려면 권한을 허용하세요.",
    "nearby.locationError": "지금 위치를 확인할 수 없습니다.",
    "nearby.title": "주변 추천",
    "nearby.description": "현재 위치를 기반으로 주변의 음식점과 즐길 거리를 찾아보세요.",
    "nearby.finding": "주변 찾는 중...",
    "nearby.findButton": "내 주변 음식 & 즐길거리 찾기",
    "nearby.usingLocation": "다음 위치 주변 사용 중:",
    "nearby.placesToEat": "식사할 곳",
    "nearby.noFood": "주변 음식점 추천을 찾을 수 없습니다.",
    "nearby.placesToExplore": "둘러볼 곳",
    "nearby.noFun": "주변 활동 추천을 찾을 수 없습니다.",
    "nearby.placesConvenience": "근처 편의점",
    "nearby.noConvenience": "주변 편의점 추천을 찾을 수 없습니다.",
    "nearby.placesSimCard": "근처에서 유심/모바일 데이터 구매",
    "nearby.noSimCard": "주변 유심 매장을 찾을 수 없습니다.",
    "translate.title": "양방향 통역",
    "translate.description": "말하거나 입력하면 앞에 있는 상대방을 위해 텍스트와 음성으로 통역해 드립니다.",
    "translate.travelerToggle": "당신이 말하기",
    "translate.localToggle": "현지인이 말하기",
    "translate.inputPlaceholder": "입력하거나 마이크를 누르세요…",
    "translate.send": "통역하기",
    "translate.sending": "통역 중…",
    "translate.addPhoto": "사진",
    "translate.play": "재생",
    "translate.historyTitle": "대화 기록",
    "translate.searchPlaceholder": "이 대화 검색…",
    "translate.noHistory": "아직 메시지가 없습니다 — 위에서 대화를 시작하세요.",
    "translate.noResults": "검색 결과와 일치하는 메시지가 없습니다.",
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
    "welcome.greeting": "欢迎",
    "assistant.title": "查询价格、地点或人物",
    "assistant.description":
      "输入出租车费、酒店名称或情况描述,即可根据社区报告和已知诈骗警告获得可信度评估。",
    "assistant.placeholder": "例如:Grand Palace Hotel 机场接送",
    "assistant.warnings": "警告:",
    "assistant.travelersSay": "旅行者怎么说:",
    "assistant.qa1Question": "这个从机场出发的出租车价格正常吗?",
    "assistant.qa1Answer":
      "出发前请司机确认使用计价器或固定总价,然后与打车软件的预估价格进行比较。",
    "assistant.qa2Question": "一个陌生人说我的酒店已关闭并提出帮助。",
    "assistant.qa2Answer": "请保持警惕。直接联系酒店确认,不要交出手机、包或预订信息。",
    "scamCheck.verdictScam": "很可能是已知诈骗",
    "scamCheck.verdictCheck": "值得再次确认",
    "scamCheck.verdictClear": "没有明显诈骗迹象",
    "scamCheck.title": "这是诈骗吗?",
    "scamCheck.description":
      "描述发生的事情——可以说话或打字,任何语言都可以。我会对照已知诈骗模式进行核对,并告诉你如何处理。",
    "scamCheck.placeholder": "例如:司机不肯打表,要求固定价格。",
    "scamCheck.stop": "停止",
    "scamCheck.speak": "说话",
    "scamCheck.checking": "检查中…",
    "scamCheck.checkIt": "检查一下",
    "scamCheck.transcribing": "正在转换你的语音…",
    "safety.welcome": "我就在你身边。告诉我哪里感觉不对——我们会冷静地一起解决。",
    "safety.inputPlaceholder": "或用你自己的话描述…",
    "safety.shareLocation": "分享我的位置",
    "safety.shareLocationHint": "默认关闭。打开后可获得针对你所在位置的路线。",
    "safety.privacyWhat": "你在此输入的内容(以及仅在分享时的位置信息)",
    "companion.welcome":
      "你好,我是你的同伴。有任何问题都可以问我,点击麦克风说话,或添加收据/价格牌照片,我会帮你检查。",
    "companion.fallbackReply": "我在这里帮助你。",
    "companion.open": "打开",
    "companion.thinking": "思考中…",
    "companion.photoAttached": "已附加照片",
    "companion.remove": "移除",
    "companion.addPhoto": "添加照片",
    "companion.inputPlaceholder": "问我任何问题…",
    "companion.send": "发送",
    "safetyPage.title": "有我在",
    "safetyPage.description":
      "感到不安吗?这种直觉值得信任。我会帮你回到安全的地方——更明亮、更热闹的路线,可靠的乘车方式,正确的越南语表达,以及安心之前的安静确认。没有警报,只有冷静的计划。",
    "emergency.title": "立即获取帮助",
    "emergency.description":
      "大按钮,无需打字。即使网络较弱,此页面也能正常使用——下方号码可从手机直接拨打。",
    "emergency.sos": "SOS - 报警 (113)",
    "emergency.localNumbers": "本地紧急电话",
    "emergency.touristHotlines": "游客支持热线",
    "emergency.showLocal": "将此内容展示给当地人以寻求帮助",
    "emergency.nearestHospital": "最近的医院",
    "emergency.embassyContact": "大使馆联系方式",
    "home.entryMode": "入口模式",
    "home.heroDescription":
      "为独自旅行的女性打造的安全优先助手。提问、说话,或拍下价格照片——我会为你指引正确的模式。",
    "home.todosLabel": "Supabase Todos",
    "home.noTodos": "未找到待办事项。",
    "home.cardFirstNight": "First Night",
    "home.cardFirstNightDesc": "7个简单问题,生成生存时间线。",
    "home.cardTimeline": "生存时间线",
    "home.cardTimelineDesc": "预览分步输出格式。",
    "home.cardSafety": "安全模式",
    "home.cardSafetyDesc": "预防性帮助:安全路线、常用语、静默模式。",
    "home.cardAssistant": "助手",
    "home.cardAssistantDesc": "可信度检查与语音诈骗检测。",
    "home.cardEmergency": "紧急模式",
    "home.cardEmergencyDesc": "SOS 操作与紧急联系人。",
    "privacy.title": "隐私保护",
    "privacy.intro":
      "你使用这个应用时常常是疲惫、独自一人或紧张的。你不应该为了一点帮助而牺牲隐私。以下是你的数据具体会发生什么——用简单的语言说明。",
    "privacy.sendTitle": "我们会发送到设备之外的内容",
    "privacy.sendWords":
      "你输入或说出的内容会发送给 OpenAI 以生成建议。语音会被转换为文字,之后音频会被丢弃。",
    "privacy.sendLocation":
      "只有当你主动开启时,位置信息才会被发送,且仅用于判断附近更安全的路线。默认关闭。",
    "privacy.dontTitle": "我们不会做的事",
    "privacy.dontAccount": "除维持你账户所需之外,不在服务器上保存记录。",
    "privacy.dontSell": "我们不会出售数据或建立你的个人画像。",
    "privacy.dontTrack": "我们不会在后台追踪你的实时位置。",
    "privacy.controlTitle": "你始终掌握控制权",
    "privacy.controlNoLocation": "诈骗检查和价格检查无需分享位置即可使用。",
    "privacy.controlSafetyOff": "你可以在关闭位置的情况下使用安全模式。",
    "privacy.controlCoverDetails":
      "分享收据照片前,请遮盖任何个人信息(姓名、卡号、预订码)——价格检查只需要项目和金额。",
    "privacy.disclaimer":
      "这是一个黑客马拉松原型。建议仅供参考,不构成保证,第三方服务(OpenAI、地图提供商)有其自己的条款。",
    "account.logout": "退出登录",
    "login.confirmationNotice": "我们已向你的邮箱发送确认链接。确认后请登录。",
    "login.genericError": "出了点问题。",
    "login.titleSignin": "欢迎回来",
    "login.titleSignup": "创建你的账户",
    "login.subtitle": "你在越南最初几个小时的安全同伴。",
    "login.emailPlaceholder": "邮箱",
    "login.passwordPlaceholder": "密码",
    "login.pleaseWait": "请稍候…",
    "login.signIn": "登录",
    "login.createAccount": "创建账户",
    "login.newHere": "第一次来?",
    "login.alreadyHaveAccount": "已有账户?",
    "nearby.rating": "评分",
    "nearby.noRating": "暂无评分",
    "nearby.reviews": "条评价",
    "nearby.noGeoSupport": "你的浏览器不支持位置访问。",
    "nearby.loadError": "无法加载附近推荐。",
    "nearby.permissionDenied": "位置权限被拒绝。请启用以获取附近推荐。",
    "nearby.locationError": "目前无法读取你的位置。",
    "nearby.title": "附近推荐",
    "nearby.description": "使用你当前的位置查找附近的美食和好玩的地方。",
    "nearby.finding": "正在查找附近…",
    "nearby.findButton": "查找我附近的美食和活动",
    "nearby.usingLocation": "正在使用以下位置附近:",
    "nearby.placesToEat": "用餐地点",
    "nearby.noFood": "未找到附近的美食推荐。",
    "nearby.placesToExplore": "探索地点",
    "nearby.noFun": "未找到附近的活动推荐。",
    "nearby.placesConvenience": "附近的便利店",
    "nearby.noConvenience": "未找到附近的便利店推荐。",
    "nearby.placesSimCard": "附近购买SIM卡/移动数据",
    "nearby.noSimCard": "未找到附近的SIM卡店。",
    "translate.title": "双向翻译",
    "translate.description": "说话或打字,我会为你面前的人提供文字和语音翻译。",
    "translate.travelerToggle": "你说话",
    "translate.localToggle": "当地人说话",
    "translate.inputPlaceholder": "输入或点击麦克风…",
    "translate.send": "翻译",
    "translate.sending": "翻译中…",
    "translate.addPhoto": "照片",
    "translate.play": "播放",
    "translate.historyTitle": "对话记录",
    "translate.searchPlaceholder": "搜索此对话…",
    "translate.noHistory": "还没有消息 — 在上方开始对话。",
    "translate.noResults": "没有符合搜索条件的消息。",
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
    "welcome.greeting": "Добро пожаловать",
    "assistant.title": "Спросите о цене, месте или человеке",
    "assistant.description":
      "Введите стоимость такси, название отеля или опишите ситуацию — и получите оценку надёжности на основе отчётов путешественников и известных схем мошенничества.",
    "assistant.placeholder": "Например: Grand Palace Hotel, трансфер из аэропорта",
    "assistant.warnings": "Предупреждения:",
    "assistant.travelersSay": "Что говорят путешественники:",
    "assistant.qa1Question": "Нормальна ли эта цена такси из аэропорта?",
    "assistant.qa1Answer":
      "Попросите водителя включить счётчик или назвать фиксированную цену перед поездкой, затем сравните с оценкой в приложении для заказа такси.",
    "assistant.qa2Question": "Незнакомец говорит, что мой отель закрыт, и предлагает помощь.",
    "assistant.qa2Answer":
      "Отнеситесь с подозрением. Проверьте напрямую у отеля и не передавайте телефон, сумку или данные бронирования.",
    "scamCheck.verdictScam": "Похоже на известное мошенничество",
    "scamCheck.verdictCheck": "Стоит перепроверить",
    "scamCheck.verdictClear": "Явных признаков мошенничества нет",
    "scamCheck.title": "Это мошенничество?",
    "scamCheck.description":
      "Опишите, что происходит — говорите или печатайте на любом языке. Я сверю это с известными схемами мошенничества и подскажу, как поступить.",
    "scamCheck.placeholder": "Например: водитель не включает счётчик и просит фиксированную цену.",
    "scamCheck.stop": "Стоп",
    "scamCheck.speak": "Говорить",
    "scamCheck.checking": "Проверяю…",
    "scamCheck.checkIt": "Проверить",
    "scamCheck.transcribing": "Расшифровываю ваш голос…",
    "safety.welcome":
      "Я рядом с вами. Расскажите, что кажется не так — мы спокойно во всём разберёмся вместе.",
    "safety.inputPlaceholder": "Или напишите своими словами…",
    "safety.shareLocation": "Поделиться моим местоположением",
    "safety.shareLocationHint":
      "По умолчанию выключено. Включите, чтобы получить маршрут с учётом вашего местоположения.",
    "safety.privacyWhat": "То, что вы здесь вводите (и ваше местоположение, только если оно передано)",
    "companion.welcome":
      "Привет, я ваш спутник. Спрашивайте что угодно, нажмите на микрофон, чтобы говорить, или добавьте фото чека или ценника — я проверю его для вас.",
    "companion.fallbackReply": "Я здесь, чтобы помочь.",
    "companion.open": "Открыть",
    "companion.thinking": "Думаю…",
    "companion.photoAttached": "Фото прикреплено",
    "companion.remove": "Удалить",
    "companion.addPhoto": "Добавить фото",
    "companion.inputPlaceholder": "Спросите что угодно…",
    "companion.send": "Отправить",
    "safetyPage.title": "Я рядом",
    "safetyPage.description":
      "Чувствуете тревогу? Этому инстинкту стоит доверять. Я помогу вам вернуться в безопасное место — более светлый и людный маршрут, надёжная поездка, нужные фразы на вьетнамском и тихая проверка, пока всё не станет хорошо. Без паники — просто спокойный план.",
    "emergency.title": "Получить помощь сейчас",
    "emergency.description":
      "Крупные кнопки, ничего печатать не нужно. Эта страница работает даже при слабом сигнале — номера ниже звонят прямо с вашего телефона.",
    "emergency.sos": "SOS - Вызвать полицию (113)",
    "emergency.localNumbers": "Местные экстренные номера",
    "emergency.touristHotlines": "Горячие линии для туристов",
    "emergency.showLocal": "Покажите это местному жителю, чтобы попросить помощь",
    "emergency.nearestHospital": "Ближайшая больница",
    "emergency.embassyContact": "Контакты посольства",
    "home.entryMode": "Режим входа",
    "home.heroDescription":
      "Помощник по безопасности для женщин, путешествующих в одиночку. Задайте вопрос, скажите что-нибудь или сфотографируйте цену — я подскажу нужный режим.",
    "home.todosLabel": "Supabase Todos",
    "home.noTodos": "Задач не найдено.",
    "home.cardFirstNight": "First Night",
    "home.cardFirstNightDesc": "7 быстрых вопросов для создания плана на первую ночь.",
    "home.cardTimeline": "План на первую ночь",
    "home.cardTimelineDesc": "Предпросмотр пошагового формата вывода.",
    "home.cardSafety": "Режим безопасности",
    "home.cardSafetyDesc": "Превентивная помощь: безопасные маршруты, фразы, тихий режим.",
    "home.cardAssistant": "Ассистент",
    "home.cardAssistantDesc": "Проверка доверия и распознавание мошенничества по голосу.",
    "home.cardEmergency": "Экстренный режим",
    "home.cardEmergencyDesc": "Действия SOS и экстренные контакты.",
    "privacy.title": "Ваша конфиденциальность",
    "privacy.intro":
      "Вы часто пользуетесь этим приложением уставшей, в одиночестве или на нервах. Вам не должно приходиться жертвовать конфиденциальностью ради небольшой помощи. Вот что именно происходит с вашими данными — простым языком.",
    "privacy.sendTitle": "Что мы отправляем с вашего устройства",
    "privacy.sendWords":
      "Ваши слова (напечатанные или произнесённые) отправляются в OpenAI для генерации советов. Голос расшифровывается, после чего аудио удаляется.",
    "privacy.sendLocation":
      "Ваше местоположение отправляется только если вы его включили, и только для того, чтобы предложить более безопасный маршрут поблизости. По умолчанию выключено.",
    "privacy.dontTitle": "Чего мы не делаем",
    "privacy.dontAccount": "Не храним на серверах ничего, кроме необходимого для работы аккаунта.",
    "privacy.dontSell": "Мы не продаём данные и не создаём ваш профиль.",
    "privacy.dontTrack": "Мы не отслеживаем ваше местоположение в реальном времени в фоновом режиме.",
    "privacy.controlTitle": "Контроль остаётся за вами",
    "privacy.controlNoLocation": "Проверка мошенничества и цен работает без передачи местоположения.",
    "privacy.controlSafetyOff": "Вы можете пользоваться Режимом безопасности с выключенным местоположением.",
    "privacy.controlCoverDetails":
      "Перед тем как поделиться фото чека, скройте личные данные (имя, номер карты, код бронирования) — для проверки цены нужны только позиции и суммы.",
    "privacy.disclaimer":
      "Это прототип, созданный на хакатоне. Советы носят рекомендательный характер и не являются гарантией, а сторонние сервисы (OpenAI, картографические провайдеры) действуют по своим собственным условиям.",
    "account.logout": "Выйти",
    "login.confirmationNotice":
      "Мы отправили ссылку для подтверждения на вашу почту. Подтвердите её, затем войдите.",
    "login.genericError": "Что-то пошло не так.",
    "login.titleSignin": "С возвращением",
    "login.titleSignup": "Создайте аккаунт",
    "login.subtitle": "Ваш спутник по безопасности на первые часы во Вьетнаме.",
    "login.emailPlaceholder": "Эл. почта",
    "login.passwordPlaceholder": "Пароль",
    "login.pleaseWait": "Пожалуйста, подождите…",
    "login.signIn": "Войти",
    "login.createAccount": "Создать аккаунт",
    "login.newHere": "Впервые здесь?",
    "login.alreadyHaveAccount": "Уже есть аккаунт?",
    "nearby.rating": "Рейтинг",
    "nearby.noRating": "Пока нет рейтинга",
    "nearby.reviews": "отзывов",
    "nearby.noGeoSupport": "Ваш браузер не поддерживает доступ к местоположению.",
    "nearby.loadError": "Не удалось загрузить рекомендации поблизости.",
    "nearby.permissionDenied":
      "Доступ к местоположению запрещён. Включите его, чтобы получить рекомендации поблизости.",
    "nearby.locationError": "Не удалось определить ваше местоположение сейчас.",
    "nearby.title": "Рядом с вами",
    "nearby.description": "Найдите еду и развлечения рядом с вами, используя ваше текущее местоположение.",
    "nearby.finding": "Ищу поблизости...",
    "nearby.findButton": "Найти еду и развлечения рядом",
    "nearby.usingLocation": "Используется местоположение рядом с:",
    "nearby.placesToEat": "Места, где поесть",
    "nearby.noFood": "Рекомендации по еде поблизости не найдены.",
    "nearby.placesToExplore": "Места для изучения",
    "nearby.noFun": "Рекомендации по развлечениям поблизости не найдены.",
    "nearby.placesConvenience": "Магазины у дома поблизости",
    "nearby.noConvenience": "Рекомендации по магазинам у дома поблизости не найдены.",
    "nearby.placesSimCard": "Купить SIM-карту / мобильный интернет рядом",
    "nearby.noSimCard": "Магазины SIM-карт поблизости не найдены.",
    "translate.title": "Двусторонний переводчик",
    "translate.description": "Говорите или печатайте — я переведу для человека рядом с вами, текстом и голосом.",
    "translate.travelerToggle": "Говорите вы",
    "translate.localToggle": "Говорит местный житель",
    "translate.inputPlaceholder": "Введите текст или нажмите на микрофон…",
    "translate.send": "Перевести",
    "translate.sending": "Перевожу…",
    "translate.addPhoto": "Фото",
    "translate.play": "Воспроизвести",
    "translate.historyTitle": "История разговора",
    "translate.searchPlaceholder": "Поиск по этому разговору…",
    "translate.noHistory": "Пока нет сообщений — начните разговор выше.",
    "translate.noResults": "Нет сообщений, соответствующих запросу.",
  },
  vi: {
    "onboarding.city": "Bạn đến thành phố nào?",
    "onboarding.arrivalTime": "Bạn đến lúc mấy giờ?",
    "onboarding.accommodation": "Bạn ở đâu tối nay?",
    "onboarding.accommodationPlaceholder": "Tên khách sạn / hostel",
    "onboarding.travelingAlone": "Bạn đi một mình?",
    "onboarding.firstTimeInVN": "Đây là lần đầu bạn ở Việt Nam?",
    "onboarding.hasTransport": "Bạn đã có phương tiện di chuyển chưa?",
    "onboarding.hasMobileData": "Bạn có mạng data chưa?",
    "onboarding.yes": "Có",
    "onboarding.no": "Không",
    "onboarding.submit": "Tạo Survival Timeline",
    "timeline.title": "Survival Timeline",
    "timeline.loading": "Đang chuẩn bị hành trình cho bạn...",
    "timeline.error": "Không thể kết nối máy chủ. Kiểm tra mạng và thử lại.",
    "timeline.retry": "Thử lại",
    "timeline.openMaps": "Mở trong Google Maps",
    "language.label": "Ngôn ngữ",
    "welcome.greeting": "Chào mừng",
    "assistant.title": "Hỏi về giá, địa điểm hoặc một người nào đó",
    "assistant.description":
      "Gõ giá taxi, tên khách sạn hoặc mô tả tình huống để nhận đánh giá độ tin cậy dựa trên báo cáo cộng đồng và các cảnh báo lừa đảo đã biết.",
    "assistant.placeholder": "Ví dụ: đón sân bay Grand Palace Hotel",
    "assistant.warnings": "Cảnh báo:",
    "assistant.travelersSay": "Khách du lịch nói gì:",
    "assistant.qa1Question": "Giá taxi này từ sân bay có bình thường không?",
    "assistant.qa1Answer":
      "Yêu cầu tài xế xác nhận dùng đồng hồ tính tiền hoặc giá cố định trước khi khởi hành, rồi so sánh với giá ước tính trên app gọi xe.",
    "assistant.qa2Question": "Một người lạ nói khách sạn của tôi đã đóng cửa và đề nghị giúp đỡ.",
    "assistant.qa2Answer":
      "Hãy coi đây là dấu hiệu đáng ngờ. Gọi trực tiếp cho khách sạn để xác nhận, và không đưa điện thoại, túi xách hay thông tin đặt phòng cho ai.",
    "scamCheck.verdictScam": "Rất có thể là lừa đảo đã biết",
    "scamCheck.verdictCheck": "Nên kiểm tra lại",
    "scamCheck.verdictClear": "Không có dấu hiệu lừa đảo rõ ràng",
    "scamCheck.title": "Đây có phải lừa đảo không?",
    "scamCheck.description":
      "Mô tả chuyện gì đang xảy ra — nói hoặc gõ, bằng bất kỳ ngôn ngữ nào. Tôi sẽ đối chiếu với các kiểu lừa đảo đã biết và hướng dẫn cách xử lý.",
    "scamCheck.placeholder": "Ví dụ: tài xế không chịu bật đồng hồ và đòi giá cố định.",
    "scamCheck.stop": "Dừng",
    "scamCheck.speak": "Nói",
    "scamCheck.checking": "Đang kiểm tra…",
    "scamCheck.checkIt": "Kiểm tra",
    "scamCheck.transcribing": "Đang chuyển giọng nói thành chữ…",
    "safety.welcome":
      "Tôi đang ở ngay đây với bạn. Hãy cho tôi biết điều gì khiến bạn thấy không ổn — chúng ta sẽ cùng nhau giải quyết, thật bình tĩnh.",
    "safety.inputPlaceholder": "Hoặc gõ theo cách của riêng bạn…",
    "safety.shareLocation": "Chia sẻ vị trí của tôi",
    "safety.shareLocationHint": "Mặc định tắt. Bật lên để có lộ trình phù hợp với vị trí hiện tại của bạn.",
    "safety.privacyWhat": "Nội dung bạn gõ ở đây (và vị trí của bạn, chỉ khi được chia sẻ)",
    "companion.welcome":
      "Xin chào, tôi là người bạn đồng hành của bạn. Hỏi tôi bất cứ điều gì, bấm micro để nói, hoặc thêm ảnh hoá đơn/bảng giá và tôi sẽ kiểm tra giúp bạn.",
    "companion.fallbackReply": "Tôi luôn ở đây để giúp bạn.",
    "companion.open": "Mở",
    "companion.thinking": "Đang suy nghĩ…",
    "companion.photoAttached": "Đã đính kèm ảnh",
    "companion.remove": "Xoá",
    "companion.addPhoto": "Thêm ảnh",
    "companion.inputPlaceholder": "Hỏi tôi bất cứ điều gì…",
    "companion.send": "Gửi",
    "safetyPage.title": "Đã có tôi ở đây",
    "safetyPage.description":
      "Cảm thấy bất an? Trực giác đó đáng để tin. Tôi sẽ giúp bạn quay về nơi an toàn — một lộ trình sáng sủa, đông người hơn, một chuyến xe đáng tin, đúng câu tiếng Việt cần dùng, và một lần hỏi thăm nhẹ nhàng cho tới khi bạn ổn. Không báo động, chỉ có một kế hoạch bình tĩnh.",
    "emergency.title": "Cần giúp đỡ ngay",
    "emergency.description":
      "Nút bấm lớn, không cần gõ chữ. Trang này vẫn hoạt động dù mạng yếu — các số bên dưới gọi trực tiếp từ điện thoại của bạn.",
    "emergency.sos": "SOS - Gọi Công an (113)",
    "emergency.localNumbers": "Số khẩn cấp địa phương",
    "emergency.touristHotlines": "Đường dây hỗ trợ du khách",
    "emergency.showLocal": "Đưa cho người dân địa phương xem để nhờ giúp đỡ",
    "emergency.nearestHospital": "Bệnh viện gần nhất",
    "emergency.embassyContact": "Liên hệ đại sứ quán",
    "home.entryMode": "Chế độ khởi đầu",
    "home.heroDescription":
      "Trợ lý ưu tiên an toàn cho nữ du khách đi một mình. Đặt câu hỏi, nói, hoặc chụp ảnh bảng giá — tôi sẽ hướng bạn tới đúng chế độ cần dùng.",
    "home.todosLabel": "Supabase Todos",
    "home.noTodos": "Không có việc nào.",
    "home.cardFirstNight": "First Night",
    "home.cardFirstNightDesc": "7 câu hỏi nhanh để tạo Survival Timeline.",
    "home.cardTimeline": "Survival Timeline",
    "home.cardTimelineDesc": "Xem trước định dạng kết quả từng bước.",
    "home.cardSafety": "Safety Mode",
    "home.cardSafetyDesc": "Hỗ trợ phòng ngừa: lộ trình an toàn, câu nói, chế độ kín đáo.",
    "home.cardAssistant": "Assistant",
    "home.cardAssistantDesc": "Kiểm tra độ tin cậy và phát hiện lừa đảo qua giọng nói.",
    "home.cardEmergency": "Emergency",
    "home.cardEmergencyDesc": "Hành động SOS và liên hệ khẩn cấp.",
    "privacy.title": "Quyền riêng tư của bạn",
    "privacy.intro":
      "Bạn thường dùng app này lúc mệt mỏi, một mình, hoặc đang căng thẳng. Bạn không cần phải đánh đổi quyền riêng tư để nhận một chút giúp đỡ. Đây là chính xác những gì xảy ra với dữ liệu của bạn — nói bằng ngôn ngữ dễ hiểu.",
    "privacy.sendTitle": "Những gì được gửi ra khỏi thiết bị của bạn",
    "privacy.sendWords":
      "Lời bạn gõ hoặc nói được gửi tới OpenAI để tạo lời khuyên. Giọng nói được chuyển thành chữ, sau đó file âm thanh bị xoá.",
    "privacy.sendLocation":
      "Vị trí của bạn chỉ được gửi đi nếu bạn bật lên, và chỉ để suy luận ra lộ trình an toàn hơn gần đó. Mặc định là tắt.",
    "privacy.dontTitle": "Những gì chúng tôi không làm",
    "privacy.dontAccount": "Không lưu trên máy chủ bất kỳ điều gì ngoài những gì cần thiết để duy trì tài khoản của bạn.",
    "privacy.dontSell": "Chúng tôi không bán dữ liệu hay xây dựng hồ sơ về bạn.",
    "privacy.dontTrack": "Chúng tôi không theo dõi vị trí thời gian thực của bạn ở chế độ nền.",
    "privacy.controlTitle": "Bạn luôn nắm quyền kiểm soát",
    "privacy.controlNoLocation": "Kiểm tra lừa đảo và kiểm tra giá vẫn hoạt động mà không cần chia sẻ vị trí.",
    "privacy.controlSafetyOff": "Bạn có thể dùng Safety Mode khi tắt vị trí.",
    "privacy.controlCoverDetails":
      "Trước khi chia sẻ ảnh hoá đơn, hãy che các thông tin cá nhân (tên, số thẻ, mã đặt phòng) — kiểm tra giá chỉ cần các món và số tiền.",
    "privacy.disclaimer":
      "Đây là bản demo cho hackathon. Lời khuyên chỉ mang tính tham khảo, không phải cam kết, và các dịch vụ bên thứ ba (OpenAI, nhà cung cấp bản đồ) có điều khoản riêng của họ.",
    "account.logout": "Đăng xuất",
    "login.confirmationNotice": "Chúng tôi đã gửi link xác nhận tới email của bạn. Xác nhận xong rồi đăng nhập.",
    "login.genericError": "Đã có lỗi xảy ra.",
    "login.titleSignin": "Chào mừng trở lại",
    "login.titleSignup": "Tạo tài khoản của bạn",
    "login.subtitle": "Người bạn đồng hành an toàn cho những giờ đầu tiên của bạn ở Việt Nam.",
    "login.emailPlaceholder": "Email",
    "login.passwordPlaceholder": "Mật khẩu",
    "login.pleaseWait": "Vui lòng đợi…",
    "login.signIn": "Đăng nhập",
    "login.createAccount": "Tạo tài khoản",
    "login.newHere": "Lần đầu ở đây?",
    "login.alreadyHaveAccount": "Đã có tài khoản?",
    "nearby.rating": "Đánh giá",
    "nearby.noRating": "Chưa có đánh giá",
    "nearby.reviews": "lượt đánh giá",
    "nearby.noGeoSupport": "Trình duyệt của bạn không hỗ trợ truy cập vị trí.",
    "nearby.loadError": "Không thể tải gợi ý gần đây.",
    "nearby.permissionDenied": "Quyền truy cập vị trí đã bị từ chối. Bật quyền này để nhận gợi ý gần đây.",
    "nearby.locationError": "Hiện không thể đọc được vị trí của bạn.",
    "nearby.title": "Gợi ý gần đây",
    "nearby.description": "Tìm quán ăn và chỗ vui chơi gần bạn bằng vị trí hiện tại.",
    "nearby.finding": "Đang tìm gần đây...",
    "nearby.findButton": "Tìm đồ ăn & vui chơi gần tôi",
    "nearby.usingLocation": "Đang dùng vị trí quanh:",
    "nearby.placesToEat": "Chỗ ăn uống",
    "nearby.noFood": "Không tìm thấy gợi ý quán ăn gần đây.",
    "nearby.placesToExplore": "Chỗ khám phá",
    "nearby.noFun": "Không tìm thấy gợi ý hoạt động gần đây.",
    "nearby.placesConvenience": "Cửa hàng tiện lợi gần đây",
    "nearby.noConvenience": "Không tìm thấy gợi ý cửa hàng tiện lợi gần đây.",
    "nearby.placesSimCard": "Mua SIM / data di động gần đây",
    "nearby.noSimCard": "Không tìm thấy cửa hàng SIM gần đây.",
    "translate.title": "Phiên dịch hai chiều",
    "translate.description": "Nói hoặc gõ chữ, tôi sẽ dịch cho người đang nói chuyện với bạn — bằng cả chữ viết và giọng nói.",
    "translate.travelerToggle": "Bạn nói",
    "translate.localToggle": "Người địa phương nói",
    "translate.inputPlaceholder": "Gõ chữ hoặc bấm micro…",
    "translate.send": "Dịch",
    "translate.sending": "Đang dịch…",
    "translate.addPhoto": "Ảnh",
    "translate.play": "Phát",
    "translate.historyTitle": "Lịch sử trò chuyện",
    "translate.searchPlaceholder": "Tìm trong cuộc trò chuyện này…",
    "translate.noHistory": "Chưa có tin nhắn nào — bắt đầu trò chuyện ở trên.",
    "translate.noResults": "Không có tin nhắn nào khớp với tìm kiếm.",
  },
};
