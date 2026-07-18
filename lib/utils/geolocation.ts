export type Coordinates = {
  lat: number;
  lng: number;
};

export function normalizeCoordinates(input?: Partial<Coordinates>): Coordinates | null {
  if (
    typeof input?.lat !== "number" ||
    typeof input?.lng !== "number" ||
    Number.isNaN(input.lat) ||
    Number.isNaN(input.lng)
  ) {
    return null;
  }

  return {
    lat: input.lat,
    lng: input.lng,
  };
}

const KNOWN_CITIES: { name: string; coords: Coordinates }[] = [
  { name: "Hà Nội", coords: { lat: 21.0285, lng: 105.8542 } },
  { name: "TP. Hồ Chí Minh", coords: { lat: 10.8231, lng: 106.6297 } },
  { name: "Đà Nẵng", coords: { lat: 16.0544, lng: 108.2022 } },
  { name: "Nha Trang", coords: { lat: 12.2451, lng: 109.1943 } },
  { name: "Phú Quốc", coords: { lat: 10.2202, lng: 103.9663 } },
  { name: "Huế", coords: { lat: 16.4637, lng: 107.5909 } },
  { name: "Đà Lạt", coords: { lat: 11.9404, lng: 108.4583 } },
];

function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

export function findNearestCity(coords: Coordinates): string | null {
  let nearest: { name: string; distanceKm: number } | null = null;

  for (const city of KNOWN_CITIES) {
    const distanceKm = haversineDistanceKm(coords, city.coords);
    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = { name: city.name, distanceKm };
    }
  }

  return nearest?.name ?? null;
}
