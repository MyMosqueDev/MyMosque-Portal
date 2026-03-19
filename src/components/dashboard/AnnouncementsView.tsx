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

type Priority = "low" | "medium" | "high";

// Colors pulled from CSS variables
const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: "High",   color: "var(--priority-high)",    bg: "var(--priority-high-bg)"   },
  medium: { label: "Medium", color: "var(--priority-medium)",  bg: "var(--priority-medium-bg)" },
  low:    { label: "Low",    color: "var(--mosque-green)",     bg: "var(--mosque-green-subtle)" },
};

const emptyForm = {
  title: "",
  body: "",
  image: null as string | null,
  imageFile: null as File | null,
  priority: "medium" as Priority,
};

type FilterTab = "all" | Priority;

export default function AnnouncementsView() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [showInlineForm, setShowInlineForm]   = useState(false);
  const [editingId, setEditingId]             = useState<number | null>(null);
  const [form, setForm]                       = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const utils = trpc.useUtils();
  const cached = getCache();

  const { data: announcements = [], isLoading, isError: isListError } =
    trpc.mosque.listAnnouncements.useQuery(undefined, {
      initialData: cached?.announcements?.length ? cached.announcements : undefined,
      initialDataUpdatedAt: cached?.fetchedAt,
    });

  // Write fresh data back to cache
  useEffect(() => {
    console.log("announcements", announcements);
    if (announcements.length) setCache({ announcements });
  }, [announcements]);

  const createMutation = trpc.mosque.createAnnouncement.useMutation({
    onSuccess: () => {
      utils.mosque.listAnnouncements.invalidate();
      toast.success("Announcement posted");
      closeForm();
    },
    onError(err) {
      toast.error(friendlyError(err));
    },
  });

  const updateMutation = trpc.mosque.updateAnnouncement.useMutation({
    onSuccess: () => {
      utils.mosque.listAnnouncements.invalidate();
      toast.info("Announcement updated");
      closeForm();
    },
    onError(err) {
      toast.error(friendlyError(err));
    },
  });

  const deleteMutation = trpc.mosque.deleteAnnouncement.useMutation({
    onSuccess: () => {
      utils.mosque.listAnnouncements.invalidate();
      toast.warning("Announcement deleted");
      setDeleteConfirmId(null);
    },
    onError(err) {
      toast.error(friendlyError(err));
    },
  });

  const filtered = activeFilter === "all"
    ? announcements
    : announcements.filter((a) => a.severity === activeFilter);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowInlineForm(true);
  }

  function openEdit(a: (typeof announcements)[number]) {
    setEditingId(a.id);
    setForm({
      title: a.title,
      body: a.description,
      image: a.image,
      imageFile: null,
      priority: a.severity as Priority,
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

  async function handleSave() {
    setAttemptedSubmit(true);
    if (!form.title.trim() || !form.body.trim()) return;

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
        URL.revokeObjectURL(form.image!);
      } catch {
        toast.error("Image upload failed");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (editingId !== null) {
      updateMutation.mutate({
        id: editingId,
        title: form.title,
        description: form.body,
        severity: form.priority,
        image: imageUrl,
      });
    } else {
      createMutation.mutate({
        title: form.title,
        description: form.body,
        severity: form.priority,
        image: imageUrl,
      });
    }
  }

  const isSaving = isUploading || createMutation.isPending || updateMutation.isPending;

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
            <p className="text-sm text-gray-400 mt-0.5">
              {isLoading ? "Loading…" : `${announcements.length} total`}
            </p>
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
              <div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Title *"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-green/40 focus:border-mosque-green transition-colors ${attemptedSubmit && !form.title.trim() ? "border-red-400" : "border-neutral-border"}`}
                />
                {attemptedSubmit && !form.title.trim() && (
                  <p className="text-xs text-red-500 mt-1">Title is required</p>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <textarea
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="Message *"
                  rows={3}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-mosque-text placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mosque-green/40 focus:border-mosque-green transition-colors resize-none leading-relaxed flex-1 ${attemptedSubmit && !form.body.trim() ? "border-red-400" : "border-neutral-border"}`}
                />
                {attemptedSubmit && !form.body.trim() && (
                  <p className="text-xs text-red-500 mt-1">Message is required</p>
                )}
              </div>
            </div>
            <ImageUploader
              previewUrl={form.image}
              onFileSelect={(file, previewUrl) => setForm((f) => ({ ...f, image: previewUrl, imageFile: file }))}
              onClear={() => {
                if (form.imageFile && form.image?.startsWith("blob:")) URL.revokeObjectURL(form.image);
                setForm((f) => ({ ...f, image: null, imageFile: null }));
              }}
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
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-mosque-green hover:bg-mosque-green-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading…" : isSaving ? "Saving…" : editingId !== null ? "Save" : "Post"}
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
                    {announcements.filter((a) => a.severity === tab.key).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Announcement list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Loading announcements…
            </div>
          ) : isListError ? (
            <div className="px-5 py-8 text-center text-sm text-red-400">
              Failed to load announcements. Please refresh the page.
            </div>
          ) : filtered.length === 0 ? (
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
              const priority = a.severity as Priority;
              const p = PRIORITY_CONFIG[priority];
              const isLast = idx === filtered.length - 1;
              const dateStr = new Date(a.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
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
                        <span className="font-semibold text-sm text-mosque-text leading-snug">
                          {a.title}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ color: p.color, backgroundColor: p.bg }}
                        >
                          {p.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1.5">
                        {a.description}
                      </p>
                      {a.image && (
                        <div className="mt-3 rounded-xl overflow-hidden h-32 w-48">
                          <img
                            src={a.image}
                            alt="Announcement"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-300 font-medium">{dateStr}</span>
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
          onConfirm={() => deleteMutation.mutate({ id: deleteConfirmId })}
          onCancel={() => setDeleteConfirmId(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
