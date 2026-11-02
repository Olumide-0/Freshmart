// Demo-only order tracking simulation. There is no backend or courier GPS:
// everything is derived from the time elapsed since the order was placed.
// Edit these constants to make the demo faster or slower.

export const CONFIRMED_AT_MS = 0;
export const PREPARING_AT_MS = 60_000;
export const OUT_FOR_DELIVERY_AT_MS = 120_000;
export const DELIVERED_AT_MS = 300_000;
export const START_DISTANCE_KM = 2.3;

// When each timeline step happens, in timeline order.
export const STAGE_OFFSETS_MS = [
  CONFIRMED_AT_MS,
  PREPARING_AT_MS,
  OUT_FOR_DELIVERY_AT_MS,
  DELIVERED_AT_MS,
];

// Pure: same input, same output. No clock reads in here.
export function getTrackingState(elapsedMs) {
  const elapsed = Math.max(0, Number(elapsedMs) || 0);

  const stageIndex = STAGE_OFFSETS_MS.filter((offset) => elapsed >= offset).length - 1;

  // 0 until the courier leaves, then linear to 1 at delivery.
  const routeProgress =
    elapsed <= OUT_FOR_DELIVERY_AT_MS
      ? 0
      : Math.min(1, (elapsed - OUT_FOR_DELIVERY_AT_MS) / (DELIVERED_AT_MS - OUT_FOR_DELIVERY_AT_MS));

  return {
    stageIndex,
    routeProgress,
    kmAway: START_DISTANCE_KM * (1 - routeProgress),
    remainingSeconds: Math.max(0, Math.ceil((DELIVERED_AT_MS - elapsed) / 1000)),
    isDelivered: elapsed >= DELIVERED_AT_MS,
  };
}
