import type { LanguageCode } from "./translations";

type FallbackTimelineText = {
  title: (city: string) => string;
  summary: string;
  arrivalTitle: string;
  arrivalDescription: string;
  checkinTitle: (hotel: string) => string;
  checkinDescription: string;
  essentialsTitle: string;
  essentialsDescription: string;
  restTitle: string;
  restDescription: string;
};

export const fallbackTimelineText: Record<LanguageCode, FallbackTimelineText> = {
  en: {
    title: (city) => `First night plan for ${city}`,
    summary: "Low-friction arrival plan focused on transport, check-in, food, and rest.",
    arrivalTitle: "Secure transport first",
    arrivalDescription:
      "Use an official taxi stand or ride-hailing app and avoid informal offers inside the airport or station.",
    checkinTitle: (hotel) => `Reach ${hotel}`,
    checkinDescription:
      "Check address in-app before moving, keep valuables zipped, and message one trusted contact when you arrive.",
    essentialsTitle: "Get essentials nearby",
    essentialsDescription:
      "Buy water, a snack, and a local SIM or eSIM if needed, but stay within a short walk of your stay.",
    restTitle: "Prep for tomorrow",
    restDescription:
      "Charge devices, set an offline map, confirm tomorrow's route, and avoid late-night exploration on arrival day.",
  },
  ko: {
    title: (city) => `${city} 첫날 밤 계획`,
    summary: "이동, 체크인, 식사, 휴식에 초점을 맞춘 간단한 도착 안내입니다.",
    arrivalTitle: "먼저 이동 수단부터 확보하세요",
    arrivalDescription:
      "공식 택시 승강장이나 차량 호출 앱을 이용하고, 공항이나 역 안에서 다가오는 비공식 제안은 피하세요.",
    checkinTitle: (hotel) => `${hotel} 도착 및 체크인`,
    checkinDescription:
      "이동하기 전에 앱에서 주소를 확인하고, 귀중품은 잘 보관하며, 도착하면 신뢰할 수 있는 연락처에 메시지를 보내세요.",
    essentialsTitle: "근처에서 필수품 구매하기",
    essentialsDescription:
      "물, 간식, 필요하면 현지 유심이나 eSIM을 구매하되, 숙소에서 가까운 곳에만 머무르세요.",
    restTitle: "내일을 위해 준비하기",
    restDescription:
      "기기를 충전하고, 오프라인 지도를 설정하고, 내일 경로를 확인하며, 도착 첫날 밤 늦은 시간에 돌아다니는 것은 피하세요.",
  },
  zh: {
    title: (city) => `${city}第一晚计划`,
    summary: "专注于交通、入住、饮食和休息的简化到达计划。",
    arrivalTitle: "先确保交通工具",
    arrivalDescription: "使用官方出租车站或叫车应用,避免在机场或车站内的非正式载客提议。",
    checkinTitle: (hotel) => `抵达${hotel}`,
    checkinDescription: "出发前在应用中确认地址,保管好贵重物品,到达后给一位信任的联系人发消息。",
    essentialsTitle: "在附近购买必需品",
    essentialsDescription: "购买水、零食,如有需要可购买当地SIM卡或eSIM,但请留在住处附近。",
    restTitle: "为明天做准备",
    restDescription: "给设备充电,设置离线地图,确认明天的路线,抵达当晚避免深夜外出。",
  },
  ru: {
    title: (city) => `План на первую ночь в городе ${city}`,
    summary: "Простой план прибытия: транспорт, заселение, еда и отдых.",
    arrivalTitle: "Сначала обеспечьте транспорт",
    arrivalDescription:
      "Используйте официальную стоянку такси или приложение для заказа поездок и избегайте неофициальных предложений в аэропорту или на вокзале.",
    checkinTitle: (hotel) => `Доберитесь до ${hotel}`,
    checkinDescription:
      "Проверьте адрес в приложении перед выездом, храните ценные вещи в надёжном месте и напишите доверенному контакту по прибытии.",
    essentialsTitle: "Купите необходимое поблизости",
    essentialsDescription:
      "Купите воду, перекус и, если нужно, местную SIM-карту или eSIM, но оставайтесь недалеко от места проживания.",
    restTitle: "Подготовьтесь к завтрашнему дню",
    restDescription:
      "Зарядите устройства, настройте оффлайн-карту, уточните маршрут на завтра и избегайте поздних прогулок в первую ночь.",
  },
};
