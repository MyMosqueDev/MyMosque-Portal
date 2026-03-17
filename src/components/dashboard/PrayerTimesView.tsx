"use client";

import { useState } from "react";

type IqamaMode = "static" | "increment";
interface PrayerConfig { mode: IqamaMode; staticTime: string; incrementMinutes: number; }
type PrayerMap = Record<string, PrayerConfig>;
interface JummahEntry { athanTime: string; iqamaTime: string; }

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const CALC_METHODS = [
  "ISNA (Islamic Society of North America)",
  "Muslim World League", "Egyptian Authority",
  "Makkah (Umm Al-Qura)", "Karachi", "Tehran", "Jafari",
];

function fmt(min: number) {
  const h = Math.floor(min / 60) % 24, m = min % 60;
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${dh}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const monthData = Array.from({ length: 31 }, (_, i) => {
  const dst = i + 1 >= 8 ? 60 : 0;
  return {
    day: i + 1,
    fajr:    fmt(5*60 + 28 + dst + Math.round(i * 0.5)),
    sunrise: fmt(7*60 +  4 + dst + Math.round(i * 0.7)),
    dhuhr:   fmt(13*60+ 15 + dst + Math.round(i * 0.2)),
    asr:     fmt(16*60+ 38 + dst + Math.round(i * 1.0)),
    maghrib: fmt(19*60+ 27 + dst + Math.round(i * 1.1)),
    isha:    fmt(20*60+ 48 + dst + Math.round(i * 0.9)),
  };
});

function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${dh}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function PrayerTimesView() {
  const [saved, setSaved] = useState(false);

  const [prayers, setPrayers] = useState<PrayerMap>({
    Fajr:    { mode: "static",     staticTime: "06:30", incrementMinutes: 0  },
    Dhuhr:   { mode: "increment",  staticTime: "13:30", incrementMinutes: 10 },
    Asr:     { mode: "static",     staticTime: "16:30", incrementMinutes: 0  },
    Maghrib: { mode: "increment",  staticTime: "19:35", incrementMinutes: 15 },
    Isha:    { mode: "increment",  staticTime: "21:00", incrementMinutes: 0  },
  });
  const [jummah, setJummah] = useState<JummahEntry[]>([
    { athanTime: "13:00", iqamaTime: "13:30" },
    { athanTime: "14:00", iqamaTime: "14:30" },
    { athanTime: "13:30", iqamaTime: "13:45" },
  ]);
  const [lat, setLat]           = useState("30.2672");
  const [lng, setLng]           = useState("-97.7431");
  const [city, setCity]         = useState("Austin");
  const [country, setCountry]   = useState("USA");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [hanafiAsr, setHanafiAsr] = useState(false);
  const [calcMethod, setCalcMethod] = useState(0);

  const updP = (p: string, patch: Partial<PrayerConfig>) =>
    setPrayers(prev => ({ ...prev, [p]: { ...prev[p], ...patch } }));

  const finalLabel = (prayer: string) => {
    const p = prayers[prayer];
    return p.mode === "static"
      ? `Final: ${formatTime12(p.staticTime)}`
      : `Final: Iqama + ${p.incrementMinutes}`;
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#699A51]/40 focus:border-[#699A51] transition-colors";
  const labelCls = "text-xs font-semibold text-gray-400 uppercase tracking-wide";

  return (
    <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#4A4A4A]">Prayer Times</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage iqama times and prayer schedule</p>
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#699A51] text-white hover:bg-[#5c8846]"}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={saved ? "M5 13l4 4L19 7" : "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"} />
            </svg>
            {saved ? "Saved" : "Save Changes"}
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ════ LEFT ════ */}
          <div className="space-y-5">

            {/* Prayer Time Schedule */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-bold text-[#4A4A4A]">Prayer Time Schedule</p>
                <p className="text-xs text-gray-400 mt-0.5">Set static times or offset from Adhan for each prayer</p>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRAYERS.map(prayer => {
                  const p = prayers[prayer];
                  const isIncrement = p.mode === "increment";
                  return (
                    <div key={prayer} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-[#4A4A4A]">{prayer}</span>
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full tabular-nums">
                          {finalLabel(prayer)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3.5">
                        <button
                          onClick={() => updP(prayer, { mode: isIncrement ? "static" : "increment" })}
                          className={`relative w-10 h-[22px] rounded-full transition-colors shrink-0 ${isIncrement ? "bg-[#699A51]" : "bg-gray-200"}`}
                        >
                          <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isIncrement ? "translate-x-[22px]" : "translate-x-[3px]"}`} />
                        </button>
                        <span className="text-xs font-medium text-gray-500">{isIncrement ? "Increment" : "Static Time"}</span>
                      </div>
                      {!isIncrement ? (
                        <div>
                          <label className={`${labelCls} block mb-1.5`}>Prayer Time</label>
                          <input type="time" value={p.staticTime}
                            onChange={e => updP(prayer, { staticTime: e.target.value })}
                            className={inputCls}
                            style={{ colorScheme: "light" }}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className={`${labelCls} block mb-1.5`}>Minutes after Iqama</label>
                          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#699A51]/40 focus-within:border-[#699A51] transition-colors">
                            <input type="number" min={0} max={120} value={p.incrementMinutes}
                              onChange={e => updP(prayer, { incrementMinutes: Math.max(0, parseInt(e.target.value) || 0) })}
                              className="flex-1 px-4 py-2.5 text-sm text-[#4A4A4A] focus:outline-none bg-transparent"
                            />
                            <div className="flex flex-col border-l border-gray-200">
                              <button onClick={() => updP(prayer, { incrementMinutes: Math.min(120, p.incrementMinutes + 1) })}
                                className="px-2 py-1 text-[10px] text-gray-400 hover:text-[#4A4A4A] hover:bg-gray-50 leading-none transition-colors">▲</button>
                              <button onClick={() => updP(prayer, { incrementMinutes: Math.max(0, p.incrementMinutes - 1) })}
                                className="px-2 py-1 text-[10px] text-gray-400 hover:text-[#4A4A4A] hover:bg-gray-50 leading-none transition-colors border-t border-gray-200">▼</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jummah Prayer Times */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#4A4A4A]">Jumu&apos;ah Prayer Times</p>
                  <p className="text-xs text-gray-400 mt-0.5">Friday prayer times — applies to all schedules</p>
                </div>
                {jummah.length < 5 && (
                  <button
                    onClick={() => setJummah(p => [...p, { athanTime: "13:00", iqamaTime: "13:30" }])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#699A51] bg-[#699A51]/8 hover:bg-[#699A51]/15 transition-colors"
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
                      <span className="text-sm font-semibold text-[#4A4A4A]">
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
                        <input type="time" value={slot.athanTime}
                          onChange={e => setJummah(p => p.map((s, j) => j === i ? { ...s, athanTime: e.target.value } : s))}
                          className={inputCls} style={{ colorScheme: "light" }}
                        />
                      </div>
                      <div>
                        <label className={`${labelCls} block mb-1.5`}>Iqama Time</label>
                        <input type="time" value={slot.iqamaTime}
                          onChange={e => setJummah(p => p.map((s, j) => j === i ? { ...s, iqamaTime: e.target.value } : s))}
                          className={inputCls} style={{ colorScheme: "light" }}
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
                      className="mt-2 text-sm font-semibold text-[#699A51] hover:underline"
                    >Add one</button>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-bold text-[#4A4A4A]">Location Information</p>
                <p className="text-xs text-gray-400 mt-0.5">Used for accurate prayer time calculations</p>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-3">
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Latitude</label>
                  <input value={lat} onChange={e => setLat(e.target.value)} className={inputCls} placeholder="30.2672" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Longitude</label>
                  <input value={lng} onChange={e => setLng(e.target.value)} className={inputCls} placeholder="-97.7431" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>City</label>
                  <input value={city} onChange={e => setCity(e.target.value)} className={inputCls} placeholder="Austin" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Country</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} className={inputCls} placeholder="USA" />
                </div>
                <div className="col-span-2">
                  <label className={`${labelCls} block mb-1.5`}>Timezone</label>
                  <input value={timezone} onChange={e => setTimezone(e.target.value)} className={inputCls} placeholder="America/Chicago" />
                </div>
              </div>
            </div>

          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="space-y-5 lg:sticky lg:top-6">

            {/* Monthly Prayer Times */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-bold text-[#4A4A4A]">Monthly Prayer Times</p>
                <span className="text-xs font-semibold text-[#699A51]">March 2026</span>
              </div>
              <div className="overflow-x-auto" style={{ maxHeight: 320, overflowY: "auto" }}>
                <table className="w-full text-xs min-w-[280px]">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-400 w-9">Day</th>
                      <th className="px-2 py-2.5 text-right font-semibold text-gray-400">Fajr</th>
                      <th className="px-2 py-2.5 text-right font-semibold text-gray-400">Dhuhr</th>
                      <th className="px-2 py-2.5 text-right font-semibold text-gray-400">Asr</th>
                      <th className="px-2 py-2.5 text-right font-semibold text-gray-400">Maghrib</th>
                      <th className="px-2 py-2.5 text-right font-semibold text-gray-400">Isha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.map(row => (
                      <tr key={row.day} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-2 font-bold text-gray-500 tabular-nums">
                          {String(row.day).padStart(2, "0")}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-600 tabular-nums">{row.fajr}</td>
                        <td className="px-2 py-2 text-right text-gray-600 tabular-nums">{row.dhuhr}</td>
                        <td className="px-2 py-2 text-right text-gray-600 tabular-nums">{row.asr}</td>
                        <td className="px-2 py-2 text-right text-gray-600 tabular-nums">{row.maghrib}</td>
                        <td className="px-2 py-2 text-right text-gray-600 tabular-nums">{row.isha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-bold text-[#4A4A4A]">Settings</p>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#4A4A4A]">Hanafi Asr Times</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Use Hanafi calculation method for Asr prayer times</p>
                  </div>
                  <button
                    onClick={() => setHanafiAsr(!hanafiAsr)}
                    className={`relative w-10 h-[22px] rounded-full transition-colors shrink-0 mt-0.5 ${hanafiAsr ? "bg-[#699A51]" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hanafiAsr ? "translate-x-[22px]" : "translate-x-[3px]"}`} />
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <label className={`${labelCls} block mb-2`}>Calculation Method</label>
                  <select value={calcMethod} onChange={e => setCalcMethod(parseInt(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#699A51]/40 focus:border-[#699A51] transition-colors bg-white appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
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
