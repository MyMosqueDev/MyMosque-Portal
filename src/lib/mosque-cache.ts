// localStorage cache for mosque dashboard data.
// Provides instant rendering on cold-start and enables background staleness checks.

export type MosqueCache = {
  mosque: any;
  announcements: any[];
  events: any[];
  prayerTimes: Record<string, any>; // keyed by "MM-YY"
  fetchedAt: number;                // Date.now()
};

const KEY = "mosque-cache";

export function getCache(): MosqueCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MosqueCache) : null;
  } catch {
    return null;
  }
}

export function setCache(updates: Partial<Omit<MosqueCache, "fetchedAt">>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getCache() ?? {
      mosque: null,
      announcements: [],
      events: [],
      prayerTimes: {},
      fetchedAt: 0,
    };
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...current, ...updates, fetchedAt: Date.now() })
    );
  } catch {
    // Ignore storage errors (private browsing, quota exceeded, etc.)
  }
}

export function clearCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
