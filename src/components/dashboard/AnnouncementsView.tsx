"use client";

import { useState } from "react";

type Priority = "low" | "medium" | "high";

interface Announcement {
  id: number;
  title: string;
  body: string;
  image: string | null;
  priority: Priority;
  date: string;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Ramadan Schedule Now Available",
    body: "The full Tarawih and prayer schedule for Ramadan 1446 has been posted. Please check the app for daily timings, Iftar times, and Suhoor reminders. Tarawih will begin after Isha prayer each night.",
    image: null,
    priority: "high",
    date: "Mar 15, 2026",
  },
  {
    id: 2,
    title: "Jumu'ah Khutbah: The Importance of Gratitude",
    body: "This week's Jumu'ah khutbah will focus on the concept of shukr (gratitude) in daily life and how it connects us closer to Allah. The khutbah will be delivered by Sheikh Ibrahim at 1:15 PM.",
    image: null,
    priority: "medium",
    date: "Mar 13, 2026",
  },
  {
    id: 3,
    title: "Zakat Calculation Workshop",
    body: "Join us for a free workshop on calculating your annual Zakat. Sheikh Hassan will walk through the nisab threshold, applicable assets, and how to direct your Zakat locally.",
    image: "/nueces.jpg",
    priority: "low",
    date: "Mar 10, 2026",
  },
  {
    id: 4,
    title: "Parking Notice: East Lot Closed",
    body: "The east parking lot will be closed for resurfacing from March 18–20. Please use the main lot or street parking during this period. We apologize for the inconvenience.",
    image: null,
    priority: "medium",
    date: "Mar 9, 2026",
  },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: "High",   color: "#DC2626", bg: "#FEF2F2" },
  medium: { label: "Medium", color: "#D97706", bg: "#FFFBEB" },
  low:    { label: "Low",    color: "#699A51", bg: "#F0F7EC" },
};

const emptyForm = { title: "", body: "", image: null as string | null, priority: "medium" as Priority };

type FilterTab = "all" | Priority;

export default function AnnouncementsView() {
  const [announcements, setAnnouncements]     = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [activeFilter, setActiveFilter]       = useState<FilterTab>("all");
  const [showInlineForm, setShowInlineForm]   = useState(false);
  const [editingId, setEditingId]             = useState<number | null>(null);
  const [form, setForm]                       = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [imageFileName, setImageFileName]     = useState<string | null>(null);

  const filtered = activeFilter === "all"
    ? announcements
    : announcements.filter((a) => a.priority === activeFilter);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFileName(null);
    setShowInlineForm(true);
  }

  function openEdit(a: Announcement) {
    setEditingId(a.id);
    setForm({ title: a.title, body: a.body, image: a.image, priority: a.priority });
    setImageFileName(a.image ? "existing-image.jpg" : null);
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
    if (!form.title.trim() || !form.body.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (editingId !== null) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form, date: today } : a))
      );
    } else {
      const newId = Math.max(0, ...announcements.map((a) => a.id)) + 1;
      setAnnouncements((prev) => [{ id: newId, ...form, date: today }, ...prev]);
    }
    closeForm();
  }

  function handleDelete(id: number) {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
    }
  }

  const isFormValid = form.title.trim().length > 0 && form.body.trim().length > 0;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all",    label: "All"    },
    { key: "high",   label: "High"   },
    { key: "medium", label: "Medium" },
    { key: "low",    label: "Low"    },
  ];

  return (
    <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#4A4A4A]">Announcements</h1>
            <p className="text-sm text-gray-400 mt-0.5">{announcements.length} total</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-[#699A51] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#5c8846] transition-colors shadow-sm"
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
          style={{ maxHeight: showInlineForm ? "800px" : "0px" }}
        >
          <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-[#4A4A4A]">
                {editingId !== null ? "Edit Announcement" : "New Announcement"}
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#699A51]/40 focus:border-[#699A51] transition-colors"
                  />
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder="Message *"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#4A4A4A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#699A51]/40 focus:border-[#699A51] transition-colors resize-none leading-relaxed flex-1"
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
                        <span className="text-xs text-gray-300 font-medium leading-tight">Add image</span>
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
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5">
                  {(["low", "medium", "high"] as Priority[]).map((level) => {
                    const cfg = PRIORITY_CONFIG[level];
                    const selected = form.priority === level;
                    return (
                      <button
                        key={level}
                        onClick={() => setForm((f) => ({ ...f, priority: level }))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                        style={
                          selected
                            ? { color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.color }
                            : { color: "#9CA3AF", backgroundColor: "white", borderColor: "#E5E7EB" }
                        }
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: selected ? cfg.color : "#D1D5DB" }}
                        />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
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
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#699A51] hover:bg-[#5c8846] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingId !== null ? "Save" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const cfg = tab.key !== "all" ? PRIORITY_CONFIG[tab.key as Priority] : null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all border"
                style={
                  isActive && cfg
                    ? { color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.color }
                    : isActive
                    ? { color: "#4A4A4A", backgroundColor: "#E5E7EB", borderColor: "#E5E7EB" }
                    : { color: "#9CA3AF", backgroundColor: "white", borderColor: "#E5E7EB" }
                }
              >
                {tab.label}
                {tab.key !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    {announcements.filter((a) => a.priority === tab.key).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Announcement list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center px-4">
              <p className="font-semibold text-[#4A4A4A]">No announcements</p>
              <p className="text-sm text-gray-400">
                {activeFilter === "all"
                  ? "Create your first announcement above."
                  : `No ${activeFilter} priority announcements.`}
              </p>
            </div>
          ) : (
            filtered.map((a, idx) => {
              const p = PRIORITY_CONFIG[a.priority];
              const isLast = idx === filtered.length - 1;
              return (
                <div
                  key={a.id}
                  className={`px-5 py-4 ${!isLast ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: p.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#4A4A4A] leading-snug">{a.title}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ color: p.color, backgroundColor: p.bg }}
                        >
                          {p.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1.5">{a.body}</p>
                      {a.image && (
                        <div className="mt-3 rounded-xl overflow-hidden h-32 w-48">
                          <img src={a.image} alt="Announcement" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-300 font-medium">{a.date}</span>
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={() => openEdit(a)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#516D9A] bg-[#516D9A]/8 hover:bg-[#516D9A]/15 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(a.id)}
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
                  <h3 className="font-bold text-[#4A4A4A]">Delete announcement?</h3>
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
