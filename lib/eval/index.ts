/**
 * Measured false-alarm rate (FAR) on labeled fixtures.
 * Run: npm run eval:far
 * API: GET /api/eval-far
 *
 * FAR = false positives / honest cases
 * (honest seller wrongly flagged as overpriced/scam).
 */
export { measureFar, formatFarPercent } from "./measureFar";
export {
  PRICE_OVERPRICE_MULTIPLIER,
  PRICE_UNDERPRICE_MULTIPLIER,
  SCAM_CONFIDENCE_THRESHOLD,
} from "./thresholds";
