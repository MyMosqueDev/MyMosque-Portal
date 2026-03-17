"use client";

import { useState } from "react";

interface Event {
  id: number;
  title: string;
  body: string;
  image: string | null;
  date: string;
  time: string;
  location: string;
  host: string;
}

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Ramadan Iftar Night",
    body: "Join us for a community Iftar dinner to break fast together. All are welcome. Food will be provided — please RSVP so we can plan accordingly.",
    image: null,
    date: "2026-03-20",
    time: "18:30",
    location: "Banquet Hall",
    host: "Islamic Center",
  },
  {
    id: 2,
    title: "Tarawih Prayers",
    body: "Nightly Tarawih prayers will be led by Sheikh Ibrahim throughout the month of Ramadan. Doors open 15 minutes before prayer.",
    image: null,
    date: "2026-03-17",
    time: "21:00",
    location: "Main Hall",
    host: "Sheikh Ibrahim",
  },
  {
    id: 3,
    title: "Youth Halaqa",
    body: "A weekly gathering for youth ages 13–25 to discuss Islamic topics, current events, and community service opportunities.",
    image: "/nueces.jpg",
    date: "2026-03-22",
    time: "15:00",
    location: "Room 4",
    host: "Brother Yusuf",
  },
  {
    id: 4,
    title: "Sisters' Quran Circle",
    body: "A warm and welcoming space for sisters to recite, memorize, and reflect on the Quran together. All levels are welcome.",
    image: null,
    date: "2026-03-24",
    time: "19:00",
    location: "Room 2",
    host: "Sister Fatima",
  },
  {
    id: 5,
    title: "Zakat Calculation Workshop",
    body: "Sheikh Hassan will walk through the nisab threshold, applicable assets, and how to direct your Zakat locally. Free to attend.",
    image: null,
    date: "2026-03-10",
    time: "18:00",
    location: "Conference Room A",
    host: "Sheikh Hassan",
  },
];

type FilterTab = "all" | "upcoming" | "past";

const emptyForm = {
  title: "",
  body: "",
  image: null as string | null,
  date: "",
  time: "",
  location: "",
  host: "",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function isUpcoming(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T00:00:00") >= today;
}

export default function EventsView() {
  const [events, setEvents]                   = useState<Event[]>(MOCK_EVENTS);
  const [activeFilter, setActiveFilter]       = useState<FilterTab>("all");
  const [showInlineForm, setShowInlineForm]   = useState(false);
  const [editingId, setEditingId]             = useState<number | null>(null);
  const [form, setForm]                       = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [imageFileName, setImageFileName]     = useState<string | null>(null);

  const filtered =
    activeFilter === "all"
      ? events
      : activeFilter === "upcoming"
      ? events.filter((e) => isUpcoming(e.date))
      : events.filter((e) => !isUpcoming(e.date));

  const sorted = [...filtered].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFileName(null);
    setShowInlineForm(true);
  }

  function openEdit(ev: Event) {
    setEditingId(ev.id);
    setForm({ title: ev.title, body: ev.body, image: ev.image, date: ev.date, time: ev.time, location: ev.location, host: ev.host });
    setImageFileName(ev.image ? "existing-image.jpg" : null);
    setShowInlineForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowInlineForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFileName(null);
  }

  function handleSave() {
    if (!form.title.trim() || !form.body.trim() || !form.date || !form.time) return;
    if (editingId !== null) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...form } : e))
      );
    } else {
      const newId = Math.max(0, ...events.map((e) => e.id)) + 1;
      setEvents((prev) => [{ id: newId, ...form }, ...prev]);
    }
    closeForm();
  }

  function handleDelete(id: number) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
    }
  }

  const isFormValid =
    form.title.trim().length > 0 &&
    form.body.trim().length > 0 &&
    form.date.length > 0 &&
    form.time.length > 0 &&
    form.image !== null;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all",      label: "All"      },
    { key: "upcoming", label: "Upcoming" },
    { key: "past",     label: "Past"     },
  ];

  return (
    <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#4A4A4A]">Events</h1>
            <p className="text-sm text-gray-400 mt-0.5">{events.length} total</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-[#516D9A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#455f87] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        </div>

        {/* Inline create/edit form */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: showInlineForm ? "1100px" : "0px" }}
        >
          <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-[#4A4A4A]">
                {editingId !== null ? "Edit Event" : "New Event"}
              </p>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#4A4A4A] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-5 flex flex-col gap-4">
              <div className="flex gap-3 items-stretch">
                <div className="flex-1 flex flex-col gap-3">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Title *"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#516D9A]/40 focus:border-[#516D9A] transition-colors"
                  />
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder="Description *"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#516D9A]/40 focus:border-[#516D9A] transition-colors resize-none leading-relaxed flex-1"
                  />
                </div>
                <div className="relative w-40 shrink-0">
                  <label
                    className="flex flex-col items-center justify-center h-full min-h-[148px] rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden bg-gray-50 relative"
                    style={form.image ? { borderColor: "transparent" } : { borderColor: "#E5E7EB" }}
                  >
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 px-3 text-center">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-gray-300 font-medium leading-tight">Image *</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {form.image && (
                    <button
                      onClick={() => { setImageFileName(null); setForm((f) => ({ ...f, image: null })); }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#516D9A]/40 focus:border-[#516D9A] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Time *</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#516D9A]/40 focus:border-[#516D9A] transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Location"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#516D9A]/40 focus:border-[#516D9A] transition-colors"
                />
                <input
                  type="text"
                  value={form.host}
                  onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
                  placeholder="Host"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#516D9A]/40 focus:border-[#516D9A] transition-colors"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#516D9A] hover:bg-[#455f87] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingId !== null ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const count =
              tab.key === "upcoming"
                ? events.filter((e) => isUpcoming(e.date)).length
                : tab.key === "past"
                ? events.filter((e) => !isUpcoming(e.date)).length
                : null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all border"
                style={
                  isActive
                    ? { color: "#516D9A", backgroundColor: "#EEF1F7", borderColor: "#516D9A" }
                    : { color: "#9CA3AF", backgroundColor: "white", borderColor: "#E5E7EB" }
                }
              >
                {tab.label}
                {count !== null && (
                  <span className="ml-1.5 opacity-70">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Event list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center px-4">
              <p className="font-semibold text-[#4A4A4A]">No events</p>
              <p className="text-sm text-gray-400">
                {activeFilter === "all"
                  ? "Create your first event above."
                  : `No ${activeFilter} events.`}
              </p>
            </div>
          ) : (
            sorted.map((ev, idx) => {
              const upcoming = isUpcoming(ev.date);
              const isLast = idx === sorted.length - 1;
              const d = new Date(ev.date + "T00:00:00");
              const monthStr = d.toLocaleDateString("en-US", { month: "short" });
              const dayStr = d.getDate();
              return (
                <div
                  key={ev.id}
                  className={`px-5 py-4 ${!isLast ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center"
                      style={{ backgroundColor: upcoming ? "#EEF1F7" : "#F3F4F6" }}
                    >
                      <span
                        className="text-[9px] font-bold uppercase leading-none"
                        style={{ color: upcoming ? "#516D9A" : "#9CA3AF" }}
                      >
                        {monthStr}
                      </span>
                      <span
                        className="text-base font-extrabold leading-none mt-0.5"
                        style={{ color: upcoming ? "#516D9A" : "#9CA3AF" }}
                      >
                        {dayStr}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#4A4A4A] leading-snug">{ev.title}</span>
                        {!upcoming && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                            Past
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 leading-relaxed mt-1.5">{ev.body}</p>

                      {ev.image && (
                        <div className="mt-3 rounded-xl overflow-hidden h-32 w-48">
                          <img src={ev.image} alt="Event" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(ev.date)} · {formatTime(ev.time)}
                        </span>
                        {ev.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {ev.location}
                          </span>
                        )}
                        {ev.host && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {ev.host}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-3">
                        <button
                          onClick={() => openEdit(ev)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#516D9A] bg-[#516D9A]/8 hover:bg-[#516D9A]/15 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(ev.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId !== null && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#4A4A4A]">Delete event?</h3>
                  <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
