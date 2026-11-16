"use client";

import { useSyncExternalStore } from "react";

// A shared clock that ticks on each minute boundary, so the admin header's
// date and time (and the Overview's "today") roll over at midnight.

const MINUTE = 60_000;
const listeners = new Set();
let timer = null;

const notify = () => listeners.forEach((listener) => listener());

function scheduleTick() {
  // A little past the boundary, so the new minute is already showing.
  timer = setTimeout(() => {
    notify();
    scheduleTick();
  }, MINUTE - (Date.now() % MINUTE) + 50);
}

// Timers pause while a laptop sleeps: catch up when the tab is shown again.
function onVisible() {
  if (document.visibilityState === "visible") notify();
}

function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1) {
    scheduleTick();
    document.addEventListener("visibilitychange", onVisible);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearTimeout(timer);
      timer = null;
      document.removeEventListener("visibilitychange", onVisible);
    }
  };
}

// The current minute as a number (stable within the minute).
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE;
// No clock on the server: the admin renders in the browser only.
const getServerSnapshot = () => null;

// Milliseconds at the start of the current minute, or null on the server.
export function useClock() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ---- Day helpers for ?day=yyyy-mm-dd ----------------------------------------

const pad = (n) => String(n).padStart(2, "0");

// Local calendar date as "yyyy-mm-dd" (toISOString would use UTC).
export function toDayKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// "yyyy-mm-dd" -> local midnight Date, or null when it isn't a real date.
export function parseDayKey(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key ?? "");
  if (!match) return null;
  const [y, m, d] = match.slice(1).map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

// The past day picked in the admin header (?day=), or null for today.
// Today, future days and invalid values all mean "today".
export function selectedPastDay(param, nowMs) {
  const day = parseDayKey(param);
  if (!day || nowMs == null) return null;
  const now = new Date(nowMs);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return day < today ? day : null;
}
