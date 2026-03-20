export type Prayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PrayerSchedule {
  timeMode: Record<Prayer, "static" | "increment">;
  prayerTimes: Record<Prayer, string>;     // HH:MM (24h) — used when static
  incrementValues: Record<Prayer, number>; // minutes after adhan — used when increment
}

export interface PrayerDayEntry {
  day: string;
  times: {
    fajr: { adhan: string; iqama: string };
    sunrise: string;
    dhuhr: { adhan: string; iqama: string };
    asr: { adhan: string; iqama: string };
    maghrib: { adhan: string; iqama: string };
    isha: { adhan: string; iqama: string };
    sunset: string;
  };
}

// Maps prayerSettings.settings.calculationMethod string → aladhan method number
const CALC_METHOD_MAP: Record<string, number> = {
  ISNA: 2,
  MWL: 3,
  Egyptian: 5,
  Makkah: 4,
  Karachi: 1,
  Tehran: 7,
  Jafari: 0,
};

const PRAYERS: Prayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

// ── Time helpers ──────────────────────────────────────────────────────────────

/** "13:30" → "1:30 PM" */
export function convertTo12Hour(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

/** "5:45 AM" → 345 (total minutes since midnight) */
export function parse12HourToMinutes(t: string): number {
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/** 345 → "5:45 AM" */
export function minutesTo12Hour(totalMinutes: number): string {
  const clamped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

// ── Aladhan API ───────────────────────────────────────────────────────────────

interface RawDay {
  day: string;
  timings: Record<string, string>; // lowercase prayer names → "HH:MM" (12h)
}

/** Fetches a full month calendar from aladhan.com and normalises to RawDay[]. */
export async function fetchAladhanCalendar(
  address: string,
  year: number,
  month: number,
  methodName: string,
  hanafi: boolean
): Promise<RawDay[]> {
  const method = CALC_METHOD_MAP[methodName] ?? 2;
  const school = hanafi ? 1 : 0;
  const encoded = encodeURIComponent(address).replace(/%20/g, "+");
  const url = `https://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${encoded}&method=${method}&school=${school}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Aladhan API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const keys = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "sunset", "isha"];

  return (data.data as any[]).map((item: any) => {
    const [day] = item.date.gregorian.date.split("-");
    const timings: Record<string, string> = {};
    for (const key of keys) {
      const raw: string = item.timings[key.charAt(0).toUpperCase() + key.slice(1)] ?? "";
      const match = raw.match(/(\d{2}:\d{2})/);
      if (match) {
        timings[key] = convertTo12Hour(match[1]);
      }
    }
    return { day, timings };
  });
}

// ── Adaptation ────────────────────────────────────────────────────────────────

/**
 * Applies iqama rules from `schedule` to raw adhan times.
 * Pure function — no side effects.
 */
export function adaptPrayerTimes(
  rawDays: RawDay[],
  schedule: PrayerSchedule
): PrayerDayEntry[] {
  return rawDays.map((raw) => {
    const times: PrayerDayEntry["times"] = {
      sunrise: raw.timings.sunrise ?? "",
      sunset: raw.timings.sunset ?? "",
      fajr:    { adhan: "", iqama: "" },
      dhuhr:   { adhan: "", iqama: "" },
      asr:     { adhan: "", iqama: "" },
      maghrib: { adhan: "", iqama: "" },
      isha:    { adhan: "", iqama: "" },
    };

    for (const prayer of PRAYERS) {
      const adhan = raw.timings[prayer] ?? "";
      const mode = schedule.timeMode[prayer];
      let iqama: string;

      if (mode === "static") {
        iqama = convertTo12Hour(schedule.prayerTimes[prayer]);
      } else {
        const adhanMinutes = parse12HourToMinutes(adhan);
        const offset = schedule.incrementValues[prayer] ?? 0;
        iqama = minutesTo12Hour(adhanMinutes + offset);
      }

      times[prayer] = { adhan, iqama };
    }

    return { day: raw.day, times };
  });
}

// ── Orchestrator ──────────────────────────────────────────────────────────────

/**
 * Generates a full month of prayer times for a mosque.
 * Does NOT write to DB — the caller is responsible for persistence.
 *
 * @param mosque  A Mosque DB record (needs address + prayerSettings)
 * @param monthYear  Optional "MM-YY" string; defaults to current month
 */
export async function generateMonthPrayerTimes(
  mosque: { address: string; prayerSettings: any },
  monthYear?: string
): Promise<PrayerDayEntry[]> {
  const ref = monthYear
    ? (() => {
        const [mm, yy] = monthYear.split("-").map(Number);
        return { month: mm, year: 2000 + yy };
      })()
    : { month: new Date().getMonth() + 1, year: new Date().getFullYear() };

  const settings = (mosque.prayerSettings as any)?.settings ?? {};
  const schedule = (mosque.prayerSettings as any)?.schedule as PrayerSchedule;

  if (!schedule) {
    throw new Error("Mosque has no prayerSettings.schedule configured");
  }

  const rawDays = await fetchAladhanCalendar(
    mosque.address,
    ref.year,
    ref.month,
    settings.calculationMethod ?? "ISNA",
    settings.hanafiAsr ?? false
  );

  return adaptPrayerTimes(rawDays, schedule);
}
