"use client";

import { useState } from "react";
import ImageUploader from "./ui/ImageUploader";
import DeleteConfirmModal from "./ui/DeleteConfirmModal";
import InlineFormCard from "./ui/InlineFormCard";
import ItemActions from "./ui/ItemActions";
import EmptyState from "./ui/EmptyState";

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

// Colors pulled from CSS variables — no inline hex codes
const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: "High",   color: "var(--priority-high)",    bg: "var(--priority-high-bg)"   },
  medium: { label: "Medium", color: "var(--priority-medium)",  bg: "var(--priority-medium-bg)" },
  low:    { label: "Low",    color: "var(--mosque-green)",     bg: "var(--mosque-green-subtle)" },
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

  const filtered = activeFilter === "all"
    ? announcements
    : announcements.filter((a) => a.priority === activeFilter);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowInlineForm(true);
  }

  function openEdit(a: Announcement) {
    setEditingId(a.id);
    setForm({ title: a.title, body: a.body, image: a.image, priority: a.priority });
    setShowInlineForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowInlineForm(false);
    setEditingId(null);
    setForm(emptyForm);
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
            <h1 className="text-xl font-extrabold text-mosque-text">Announcements</h1>
            <p className="text-sm text-gray-400 mt-0.5">{announcements.length} total</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-mosque-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-mosque-green-dark transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        </div>

        {/* Inline create/edit form */}
        <InlineFormCard
          visible={showInlineForm}
          title={editingId !== null ? "Edit Announcement" : "New Announcement"}
          onClose={closeForm}
        >
          <div className="flex gap-3 items-stretch">
            <div className="flex-1 flex flex-col gap-3">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Title *"
                className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-green/40 focus:border-mosque-green transition-colors"
              />
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="Message *"
                rows={3}
                className="w-full border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-green/40 focus:border-mosque-green transition-colors resize-none leading-relaxed flex-1"
              />
            </div>
            <ImageUploader
              image={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              onClear={() => setForm((f) => ({ ...f, image: null }))}
            />
          </div>

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
                      : { color: "var(--neutral-inactive)", backgroundColor: "white", borderColor: "var(--neutral-border)" }
                  }
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: selected ? cfg.color : "var(--neutral-muted)" }}
                  />
                  {cfg.label}
                </button>
              );
            })}
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
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-mosque-green hover:bg-mosque-green-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {editingId !== null ? "Save" : "Post"}
            </button>
          </div>
        </InlineFormCard>

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
                    ? { color: "var(--mosque-text)", backgroundColor: "var(--neutral-border)", borderColor: "var(--neutral-border)" }
                    : { color: "var(--neutral-inactive)", backgroundColor: "white", borderColor: "var(--neutral-border)" }
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
            <EmptyState
              title="No announcements"
              description={
                activeFilter === "all"
                  ? "Create your first announcement above."
                  : `No ${activeFilter} priority announcements.`
              }
            />
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
                        <span className="font-semibold text-sm text-mosque-text leading-snug">{a.title}</span>
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
                        <div className="ml-auto">
                          <ItemActions
                            section="announcements"
                            onEdit={() => openEdit(a)}
                            onDelete={() => setDeleteConfirmId(a.id)}
                          />
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

      {deleteConfirmId !== null && (
        <DeleteConfirmModal
          entityName="announcement"
          onConfirm={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}
