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
