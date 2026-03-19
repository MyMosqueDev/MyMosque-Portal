"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ImageUploader from "./ui/ImageUploader";
import DeleteConfirmModal from "./ui/DeleteConfirmModal";
import InlineFormCard from "./ui/InlineFormCard";
import ItemActions from "./ui/ItemActions";
import EmptyState from "./ui/EmptyState";
import { trpc } from "@/trpc/react";
import { getCache, setCache } from "@/lib/mosque-cache";
import { friendlyError } from "@/lib/trpc-error";

type FilterTab = "all" | "upcoming" | "past";

const emptyForm = {
  title: "",
  body: "",
  image: "" as string,
  imageFile: null as File | null,
  date: "",
  time: "",
  location: "",
  host: "",
};

// Extract YYYY-MM-DD and HH:MM from a DateTime (UTC)
function splitDateTime(date: Date | string) {
  const d = new Date(date);
  const dateStr = d.toISOString().slice(0, 10);
  const timeStr = d.toISOString().slice(11, 16);
  return { dateStr, timeStr };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function isUpcoming(date: Date | string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
}

export default function EventsView() {
  const [activeFilter, setActiveFilter]       = useState<FilterTab>("all");
  const [showInlineForm, setShowInlineForm]   = useState(false);
  const [editingId, setEditingId]             = useState<number | null>(null);
  const [form, setForm]                       = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const utils = trpc.useUtils();
  const cached = getCache();

  const { data: events = [], isLoading, isError: isListError } = trpc.mosque.listEvents.useQuery(
    undefined,
    {
      initialData: cached?.events?.length ? cached.events : undefined,
      initialDataUpdatedAt: cached?.fetchedAt,
    }
  );

  // Write fresh data back to cache
  useEffect(() => {
    if (events.length) setCache({ events });
  }, [events]);

  const createMutation = trpc.mosque.createEvent.useMutation({
    onSuccess: () => {
      utils.mosque.listEvents.invalidate();
      toast.success("Event created");
      closeForm();
    },
    onError(err) {
      toast.error(friendlyError(err));
    },
  });

  const updateMutation = trpc.mosque.updateEvent.useMutation({
    onSuccess: () => {
      utils.mosque.listEvents.invalidate();
      toast.info("Event updated");
      closeForm();
    },
    onError(err) {
      toast.error(friendlyError(err));
    },
  });

  const deleteMutation = trpc.mosque.deleteEvent.useMutation({
    onSuccess: () => {
      utils.mosque.listEvents.invalidate();
      toast.warning("Event deleted");
      setDeleteConfirmId(null);
    },
    onError(err) {
      toast.error(friendlyError(err));
    },
  });

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
    setShowInlineForm(true);
  }

  function openEdit(ev: (typeof events)[number]) {
    setEditingId(ev.id);
    const { dateStr, timeStr } = splitDateTime(ev.date);
    setForm({
      title: ev.title,
      body: ev.description,
      image: ev.image,
      imageFile: null,
      date: dateStr,
      time: timeStr,
      location: ev.location,
      host: ev.host,
    });
    setShowInlineForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    if (form.imageFile && form.image?.startsWith("blob:")) {
      URL.revokeObjectURL(form.image);
    }
    setShowInlineForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setAttemptedSubmit(false);
  }

  function fieldError(field: keyof typeof emptyForm, label: string) {
    if (!attemptedSubmit) return null;
    const val = form[field];
    if (typeof val === "string" && val.trim().length === 0) {
      return <p className="text-xs text-red-500 mt-1">{label} is required</p>;
    }
    return null;
  }

  async function handleSave() {
    setAttemptedSubmit(true);
    if (!form.title.trim() || !form.body.trim() || !form.date || !form.time || !form.image) return;

    let imageUrl = form.image;
    if (form.imageFile) {
      setIsUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", form.imageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Image upload failed");
          return;
        }
        imageUrl = data.url;
        URL.revokeObjectURL(form.image);
      } catch {
        toast.error("Image upload failed");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const isoDate = `${form.date}T${form.time}:00Z`;
    if (editingId !== null) {
      updateMutation.mutate({
        id: editingId,
        title: form.title,
        description: form.body,
        date: isoDate,
        host: form.host,
        location: form.location,
        image: imageUrl,
      });
    } else {
      createMutation.mutate({
        title: form.title,
        description: form.body,
        date: isoDate,
        host: form.host,
        location: form.location,
        image: imageUrl,
      });
    }
  }

  const isSaving = isUploading || createMutation.isPending || updateMutation.isPending;

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
            <h1 className="text-xl font-extrabold text-mosque-text">Events</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isLoading ? "Loading…" : `${events.length} total`}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-mosque-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-mosque-blue-dark transition-colors shadow-sm"
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
          title={editingId !== null ? "Edit Event" : "New Event"}
          onClose={closeForm}
          maxHeight={1100}
        >
          <div className="flex gap-3 items-stretch">
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Title *"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-blue/40 focus:border-mosque-blue transition-colors ${attemptedSubmit && !form.title.trim() ? "border-red-400" : "border-neutral-border"}`}
                />
                {fieldError("title", "Title")}
              </div>
              <div className="flex-1 flex flex-col">
                <textarea
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="Description *"
                  rows={3}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-blue/40 focus:border-mosque-blue transition-colors resize-none leading-relaxed flex-1 ${attemptedSubmit && !form.body.trim() ? "border-red-400" : "border-neutral-border"}`}
                />
                {fieldError("body", "Description")}
              </div>
            </div>
            <div className="flex flex-col">
              <ImageUploader
                previewUrl={form.image || null}
                onFileSelect={(file, previewUrl) => setForm((f) => ({ ...f, image: previewUrl, imageFile: file }))}
                onClear={() => {
                  if (form.imageFile && form.image?.startsWith("blob:")) URL.revokeObjectURL(form.image);
                  setForm((f) => ({ ...f, image: "", imageFile: null }));
                }}
                label="Image *"
              />
              {attemptedSubmit && !form.image && (
                <p className="text-xs text-red-500 mt-1">Image is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-inactive uppercase tracking-wide">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`border rounded-xl px-4 py-2.5 text-sm text-mosque-text focus:outline-none focus:ring-2 focus:ring-mosque-blue/40 focus:border-mosque-blue transition-colors ${attemptedSubmit && !form.date ? "border-red-400" : "border-neutral-border"}`}
              />
              {fieldError("date", "Date")}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-inactive uppercase tracking-wide">Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className={`border rounded-xl px-4 py-2.5 text-sm text-mosque-text focus:outline-none focus:ring-2 focus:ring-mosque-blue/40 focus:border-mosque-blue transition-colors ${attemptedSubmit && !form.time ? "border-red-400" : "border-neutral-border"}`}
              />
              {fieldError("time", "Time")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Location"
              className="border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-blue/40 focus:border-mosque-blue transition-colors"
            />
            <input
              type="text"
              value={form.host}
              onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
              placeholder="Host"
              className="border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-blue/40 focus:border-mosque-blue transition-colors"
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
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-mosque-blue hover:bg-mosque-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading…" : isSaving ? "Saving…" : editingId !== null ? "Save" : "Create"}
            </button>
          </div>
        </InlineFormCard>

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
                    ? { color: "var(--mosque-blue)", backgroundColor: "var(--mosque-blue-subtle)", borderColor: "var(--mosque-blue)" }
                    : { color: "var(--neutral-inactive)", backgroundColor: "white", borderColor: "var(--neutral-border)" }
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
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Loading events…
            </div>
          ) : isListError ? (
            <div className="px-5 py-8 text-center text-sm text-red-400">
              Failed to load events. Please refresh the page.
            </div>
          ) : sorted.length === 0 ? (
            <EmptyState
              title="No events"
              description={
                activeFilter === "all"
                  ? "Create your first event above."
                  : `No ${activeFilter} events.`
              }
            />
          ) : (
            sorted.map((ev, idx) => {
              const upcoming = isUpcoming(ev.date);
              const isLast = idx === sorted.length - 1;
              const d = new Date(ev.date);
              const { dateStr, timeStr } = splitDateTime(ev.date);
              const monthStr = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
              const dayStr = new Date(ev.date).getUTCDate();
              return (
                <div
                  key={ev.id}
                  className={`px-5 py-4 ${!isLast ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Date tile */}
                    <div
                      className="shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center"
                      style={{ backgroundColor: upcoming ? "var(--mosque-blue-subtle)" : "var(--neutral-past)" }}
                    >
                      <span
                        className="text-[9px] font-bold uppercase leading-none"
                        style={{ color: upcoming ? "var(--mosque-blue)" : "var(--neutral-inactive)" }}
                      >
                        {monthStr}
                      </span>
                      <span
                        className="text-base font-extrabold leading-none mt-0.5"
                        style={{ color: upcoming ? "var(--mosque-blue)" : "var(--neutral-inactive)" }}
                      >
                        {dayStr}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-mosque-text leading-snug">
                          {ev.title}
                        </span>
                        {!upcoming && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-past text-neutral-inactive">
                            Past
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 leading-relaxed mt-1.5">
                        {ev.description}
                      </p>

                      <div className="mt-3 rounded-xl overflow-hidden h-32 w-48">
                        <img
                          src={ev.image}
                          alt="Event"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(dateStr)} · {formatTime(timeStr)}
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

                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <ItemActions
                          section="events"
                          onEdit={() => openEdit(ev)}
                          onDelete={() => setDeleteConfirmId(ev.id)}
                        />
                        <a
                          href={`/events/${ev.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View page
                        </a>
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
          entityName="event"
          onConfirm={() => deleteMutation.mutate({ id: deleteConfirmId })}
          onCancel={() => setDeleteConfirmId(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
