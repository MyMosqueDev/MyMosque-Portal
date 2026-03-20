"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ToggleSwitch from "./ui/ToggleSwitch";
import { trpc } from "@/trpc/react";
import { getCache, setCache } from "@/lib/mosque-cache";
import { friendlyError } from "@/lib/trpc-error";

type IqamaMode = "static" | "increment";
interface PrayerConfig { mode: IqamaMode; staticTime: string; incrementMinutes: number; }
type PrayerMap = Record<string, PrayerConfig>;
interface JummahEntry { athanTime: string; iqamaTime: string; }

interface PrayerDayEntry {
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

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const CALC_METHODS = [
  "ISNA (Islamic Society of North America)",
  "Muslim World League", "Egyptian Authority",
  "Makkah (Umm Al-Qura)", "Karachi", "Tehran", "Jafari",
];
// Maps CALC_METHODS index → calculationMethod string stored in prayerSettings
const CALC_METHOD_KEYS = ["ISNA", "MWL", "Egyptian", "Makkah", "Karachi", "Tehran", "Jafari"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asPrayerDays(record: any): PrayerDayEntry[] | null | undefined {
  return record?.prayerTimes as PrayerDayEntry[] | null | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asJummahTimes(mosqueData: any): { athanTime: string; iqamaTime: string }[] | null {
  return mosqueData?.jummahTimes ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asCoordinates(mosqueData: any): { lat: number; lng: number } | null {
  return mosqueData?.coordinates ?? null;
}

function getCurrentMonthYear() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${mm}-${yy}`;
}

function getMonthLabel() {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatTime12(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${dh}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const DEFAULT_PRAYERS: PrayerMap = {
  Fajr:    { mode: "static",     staticTime: "06:30", incrementMinutes: 0  },
  Dhuhr:   { mode: "increment",  staticTime: "13:30", incrementMinutes: 10 },
  Asr:     { mode: "static",     staticTime: "16:30", incrementMinutes: 0  },
  Maghrib: { mode: "increment",  staticTime: "19:35", incrementMinutes: 15 },
  Isha:    { mode: "increment",  staticTime: "21:00", incrementMinutes: 0  },
};

export default function PrayerTimesView() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visiblePrayers, setVisiblePrayers] = useState<Set<string>>(
    new Set(["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"])
  );

  const [prayers, setPrayers] = useState<PrayerMap>(DEFAULT_PRAYERS);
  const [jummah, setJummah] = useState<JummahEntry[]>([]);
  const [lat, setLat]             = useState("30.2672");
  const [lng, setLng]             = useState("-97.7431");
  const [city, setCity]           = useState("Austin");
  const [country, setCountry]     = useState("USA");
  const [timezone, setTimezone]   = useState("America/Chicago");
  const [hanafiAsr, setHanafiAsr] = useState(false);
  const [calcMethod, setCalcMethod] = useState(0);

  const monthYear = getCurrentMonthYear();
  const utils = trpc.useUtils();
  const cached = getCache();

  const mosque = trpc.mosque.getMe.useQuery(undefined, {
    initialData: cached?.mosque ?? undefined,
    initialDataUpdatedAt: cached?.fetchedAt,
  });
  const prayerTimesRecord = trpc.mosque.getPrayerTimes.useQuery(
    { monthYear },
    {
      initialData: cached?.prayerTimes?.[monthYear] ?? undefined,
      initialDataUpdatedAt: cached?.fetchedAt,
    }
  );
  const adhanCalendar = trpc.mosque.getAdhanCalendar.useQuery({ monthYear });
  const isGetMeError = mosque.isError;
  const isPrayerTimesError = prayerTimesRecord.isError;

  const updateJummahMutation = trpc.mosque.updateJummah.useMutation({
    onSuccess: () => utils.mosque.getMe.invalidate(),
  });

  const updatePrayerSettingsMutation = trpc.mosque.updatePrayerSettings.useMutation({
    onSuccess: () => utils.mosque.getMe.invalidate(),
  });

  const generatePrayerTimesMutation = trpc.mosque.generatePrayerTimes.useMutation({
    onSuccess: () => utils.mosque.getPrayerTimes.invalidate({ monthYear }),
  });

  // Write fresh mosque and prayer time data back to cache
  useEffect(() => {
    if (mosque.data) setCache({ mosque: mosque.data });
  }, [mosque.data]);
  useEffect(() => {
    if (prayerTimesRecord.data) {
      const existing = getCache()?.prayerTimes ?? {};
      setCache({ prayerTimes: { ...existing, [monthYear]: prayerTimesRecord.data } });
    }
  }, [prayerTimesRecord.data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize jummah + prayer settings from mosque data
  useEffect(() => {
    const times = asJummahTimes(mosque.data);
    if (times) {
      setJummah(times.map((t) => ({ athanTime: t.athanTime ?? "", iqamaTime: t.iqamaTime ?? "" })));
    }
    const coords = asCoordinates(mosque.data);
    if (coords) {
      setLat(String(coords.lat ?? "30.2672"));
      setLng(String(coords.lng ?? "-97.7431"));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ps = (mosque.data as any)?.prayerSettings;
    if (ps?.schedule) {
      const { timeMode, prayerTimes: pt, incrementValues } = ps.schedule;
      setPrayers({
        Fajr:    { mode: timeMode?.fajr    ?? "static", staticTime: pt?.fajr    ?? "06:30", incrementMinutes: incrementValues?.fajr    ?? 0 },
        Dhuhr:   { mode: timeMode?.dhuhr   ?? "static", staticTime: pt?.dhuhr   ?? "13:30", incrementMinutes: incrementValues?.dhuhr   ?? 10 },
        Asr:     { mode: timeMode?.asr     ?? "static", staticTime: pt?.asr     ?? "16:30", incrementMinutes: incrementValues?.asr     ?? 0 },
        Maghrib: { mode: timeMode?.maghrib ?? "static", staticTime: pt?.maghrib ?? "19:35", incrementMinutes: incrementValues?.maghrib ?? 15 },
        Isha:    { mode: timeMode?.isha    ?? "static", staticTime: pt?.isha    ?? "21:00", incrementMinutes: incrementValues?.isha    ?? 0 },
      });
    }
    if (ps?.settings) {
      setHanafiAsr(ps.settings.hanafiAsr ?? false);
      const methodIdx = CALC_METHOD_KEYS.indexOf(ps.settings.calculationMethod);
      if (methodIdx >= 0) setCalcMethod(methodIdx);
    }
  }, [mosque.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const prayerDays = asPrayerDays(prayerTimesRecord.data);

  const updP = (p: string, patch: Partial<PrayerConfig>) =>
    setPrayers(prev => ({ ...prev, [p]: { ...prev[p], ...patch } }));

  const finalLabel = (prayer: string) => {
    const p = prayers[prayer];
    return p.mode === "static"
      ? `Final: ${formatTime12(p.staticTime)}`
      : `Iqama + ${p.incrementMinutes}m`;
  };

  async function handleSave() {
    setSaving(true);
    try {
      // 1. Save jummah times
      await updateJummahMutation.mutateAsync(
        jummah.map((j) => ({ athanTime: j.athanTime, iqamaTime: j.iqamaTime }))
      );
      // 2. Persist iqama schedule + settings
      await updatePrayerSettingsMutation.mutateAsync({
        schedule: {
          timeMode: {
            fajr:    prayers.Fajr.mode,
            dhuhr:   prayers.Dhuhr.mode,
            asr:     prayers.Asr.mode,
            maghrib: prayers.Maghrib.mode,
            isha:    prayers.Isha.mode,
          },
          prayerTimes: {
            fajr:    prayers.Fajr.staticTime,
            dhuhr:   prayers.Dhuhr.staticTime,
            asr:     prayers.Asr.staticTime,
            maghrib: prayers.Maghrib.staticTime,
            isha:    prayers.Isha.staticTime,
          },
          incrementValues: {
            fajr:    prayers.Fajr.incrementMinutes,
            dhuhr:   prayers.Dhuhr.incrementMinutes,
            asr:     prayers.Asr.incrementMinutes,
            maghrib: prayers.Maghrib.incrementMinutes,
            isha:    prayers.Isha.incrementMinutes,
          },
        },
        settings: {
          hanafiAsr,
          calculationMethod: CALC_METHOD_KEYS[calcMethod] ?? "ISNA",
        },
      });
      // 3. Fetch adhan times from aladhan + apply iqama rules → upsert PrayerTime
      await generatePrayerTimesMutation.mutateAsync({ monthYear });
      setSaved(true);
      toast.success("Prayer times saved");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error(friendlyError(err));
      console.error("[PrayerTimesView] handleSave error", err);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-mosque-text focus:outline-none focus:ring-2 focus:ring-mosque-purple/40 focus:border-mosque-purple transition-colors";
  const labelCls = "text-xs font-semibold text-neutral-inactive uppercase tracking-wide";

  return (
    <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-mosque-text">Prayer Times</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage iqama times and prayer schedule</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-mosque-purple text-white hover:bg-mosque-purple-dark disabled:opacity-60"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d={saved ? "M5 13l4 4L19 7" : "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"} />
            </svg>
            {saving ? "Saving…" : saved ? "Saved" : "Save Changes"}
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ════ LEFT ════ */}
          <div className="space-y-5">

            {/* Prayer Time Schedule */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-bold text-mosque-text">Prayer Time Schedule</p>
                <p className="text-xs text-gray-400 mt-0.5">Set static times or offset from Adhan for each prayer</p>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRAYERS.map(prayer => {
                  const p = prayers[prayer];
                  const isIncrement = p.mode === "increment";
                  return (
                    <div key={prayer} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-mosque-text">{prayer}</span>
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full tabular-nums">
                          {finalLabel(prayer)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3.5">
                        <ToggleSwitch
                          checked={isIncrement}
                          onChange={() => updP(prayer, { mode: isIncrement ? "static" : "increment" })}
                          colorVar="var(--mosque-purple)"
                        />
                        <span className="text-xs font-medium text-gray-500">
                          {isIncrement ? "Increment" : "Static Time"}
                        </span>
                      </div>
                      {!isIncrement ? (
                        <div>
                          <label className={`${labelCls} block mb-1.5`}>Prayer Time</label>
                          <input
                            type="time"
                            value={p.staticTime}
                            onChange={e => updP(prayer, { staticTime: e.target.value })}
                            className={inputCls}
                            style={{ colorScheme: "light" }}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className={`${labelCls} block mb-1.5`}>Minutes after Adhan</label>
                          <div className="flex items-center border border-neutral-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-mosque-purple/40 focus-within:border-mosque-purple transition-colors">
                            <input
                              type="number"
                              min={0}
                              max={120}
                              value={p.incrementMinutes}
                              onChange={e => updP(prayer, { incrementMinutes: Math.max(0, parseInt(e.target.value) || 0) })}
                              className="flex-1 px-4 py-2.5 text-sm text-mosque-text focus:outline-none bg-transparent"
                            />
                            <div className="flex flex-col border-l border-neutral-border">
                              <button onClick={() => updP(prayer, { incrementMinutes: Math.min(120, p.incrementMinutes + 1) })} className="px-2 py-1 text-[10px] text-gray-400 hover:text-mosque-text hover:bg-gray-50 leading-none transition-colors">▲</button>
                              <button onClick={() => updP(prayer, { incrementMinutes: Math.max(0, p.incrementMinutes - 1) })} className="px-2 py-1 text-[10px] text-gray-400 hover:text-mosque-text hover:bg-gray-50 leading-none transition-colors border-t border-neutral-border">▼</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jumu'ah Prayer Times */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-mosque-text">Jumu&apos;ah Prayer Times</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {mosque.isLoading ? "Loading…" : isGetMeError ? "Failed to load mosque data" : "Friday prayer times — applies to all schedules"}
                  </p>
                </div>
                {jummah.length < 5 && (
                  <button
                    onClick={() => setJummah(p => [...p, { athanTime: "13:00", iqamaTime: "13:30" }])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-mosque-purple bg-mosque-purple/8 hover:bg-mosque-purple/15 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-100">
                {jummah.map((slot, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-mosque-text">
                        {i === 0 ? "First Jumu'ah" : `Jumu'ah ${i + 1}`}
                      </span>
                      <button
                        onClick={() => setJummah(p => p.filter((_, j) => j !== i))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`${labelCls} block mb-1.5`}>Athan Time</label>
                        <input
                          type="time"
                          value={slot.athanTime}
                          onChange={e => setJummah(p => p.map((s, j) => j === i ? { ...s, athanTime: e.target.value } : s))}
                          className={inputCls}
                          style={{ colorScheme: "light" }}
                        />
                      </div>
                      <div>
                        <label className={`${labelCls} block mb-1.5`}>Iqama Time</label>
                        <input
                          type="time"
                          value={slot.iqamaTime}
                          onChange={e => setJummah(p => p.map((s, j) => j === i ? { ...s, iqamaTime: e.target.value } : s))}
                          className={inputCls}
                          style={{ colorScheme: "light" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {jummah.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-gray-400">No Jumu&apos;ah times configured.</p>
                    <button
                      onClick={() => setJummah([{ athanTime: "13:00", iqamaTime: "13:30" }])}
                      className="mt-2 text-sm font-semibold text-mosque-purple hover:underline"
                    >
                      Add one
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-mosque-text">Location Information</p>
                  <p className="text-xs text-gray-400 mt-0.5">Used for accurate prayer time calculations</p>
                </div>
                <span className="text-xs text-gray-400 italic">Contact admin to change</span>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-3">
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Latitude</label>
                  <input value={lat} readOnly className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-500`} placeholder="30.2672" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Longitude</label>
                  <input value={lng} readOnly className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-500`} placeholder="-97.7431" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>City</label>
                  <input value={city} readOnly className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-500`} placeholder="Austin" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Country</label>
                  <input value={country} readOnly className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-500`} placeholder="USA" />
                </div>
                <div className="col-span-2">
                  <label className={`${labelCls} block mb-1.5`}>Timezone</label>
                  <input value={timezone} readOnly className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-500`} placeholder="America/Chicago" />
                </div>
              </div>
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="space-y-5 lg:sticky lg:top-6">

            {/* Monthly Prayer Times */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-bold text-mosque-text">Monthly Prayer Times</p>
                <span className="text-xs font-semibold text-mosque-purple">{getMonthLabel()}</span>
              </div>
              {/* Prayer filter pills */}
              <div className="px-4 py-2.5 border-b border-gray-100 flex flex-wrap gap-1.5">
                {[
                  { label: "Fajr",    color: "#516D9A" },
                  { label: "Sunrise", color: "#9CA3AF" },
                  { label: "Dhuhr",   color: "#699A51" },
                  { label: "Asr",     color: "#699A51" },
                  { label: "Maghrib", color: "#67519A" },
                  { label: "Isha",    color: "#516D9A" },
                ].map(({ label, color }) => {
                  const active = visiblePrayers.has(label);
                  return (
                    <button
                      key={label}
                      onClick={() => setVisiblePrayers(prev => {
                        const next = new Set(prev);
                        next.has(label) ? next.delete(label) : next.add(label);
                        return next;
                      })}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all"
                      style={active
                        ? { backgroundColor: color + "18", color, borderColor: color + "40" }
                        : { backgroundColor: "transparent", color: "#9CA3AF", borderColor: "#E5E7EB" }
                      }
                    >
                      {active && (
                        <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor">
                          <circle cx="5" cy="5" r="4" />
                        </svg>
                      )}
                      {label}
                    </button>
                  );
                })}
              </div>
              <div style={{ maxHeight: 380, overflowY: "auto" }}>
                {adhanCalendar.isLoading ? (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">Loading…</div>
                ) : adhanCalendar.isError ? (
                  <div className="px-5 py-8 text-center text-sm text-red-400">Failed to load prayer times.</div>
                ) : !adhanCalendar.data?.length ? (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">No prayer times for this month.</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {adhanCalendar.data.map(row => {
                      const rows = [
                        { label: "Fajr",    time: row.timings.fajr    },
                        { label: "Sunrise", time: row.timings.sunrise  },
                        { label: "Dhuhr",   time: row.timings.dhuhr   },
                        { label: "Asr",     time: row.timings.asr     },
                        { label: "Maghrib", time: row.timings.maghrib  },
                        { label: "Isha",    time: row.timings.isha    },
                      ];
                      return (
                        <div key={row.day} className="flex gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                          <div className="w-7 shrink-0 pt-px">
                            <span className="text-xs font-bold text-mosque-purple tabular-nums">
                              {parseInt(row.day)}
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            {rows.map(p => {
                              const active = visiblePrayers.has(p.label);
                              return (
                                <div key={p.label} className="flex items-center justify-between">
                                  <span className={`text-[10px] font-medium w-12 transition-colors ${active ? "text-gray-400" : "text-gray-200"}`}>{p.label}</span>
                                  <span className={`text-[10px] font-semibold tabular-nums transition-colors ${active ? "text-gray-600" : "text-gray-200"}`}>{p.time}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-bold text-mosque-text">Settings</p>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-mosque-text">Hanafi Asr Times</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      Use Hanafi calculation method for Asr prayer times
                    </p>
                  </div>
                  <div className="mt-0.5">
                    <ToggleSwitch
                      checked={hanafiAsr}
                      onChange={() => setHanafiAsr(!hanafiAsr)}
                      colorVar="var(--mosque-purple)"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <label className={`${labelCls} block mb-2`}>Calculation Method</label>
                  <select
                    value={calcMethod}
                    onChange={e => setCalcMethod(parseInt(e.target.value))}
                    className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-mosque-text focus:outline-none focus:ring-2 focus:ring-mosque-purple/40 focus:border-mosque-purple transition-colors bg-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                    }}
                  >
                    {CALC_METHODS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
