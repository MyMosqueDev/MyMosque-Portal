"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/trpc/react";
import { getCache } from "@/lib/mosque-cache";
import DashboardHome from "@/components/dashboard/DashboardHome";
import AnnouncementsView from "@/components/dashboard/AnnouncementsView";
import EventsView from "@/components/dashboard/EventsView";
import PrayerTimesView from "@/components/dashboard/PrayerTimesView";

type View = "dashboard" | "announcements" | "events" | "prayer-times";

const navItems: { label: string; view: View | null }[] = [
  { label: "Dashboard",     view: "dashboard"     },
  { label: "Announcements", view: "announcements" },
  { label: "Events",        view: "events"        },
  { label: "Prayer Times",  view: "prayer-times"  },
];

const VALID_VIEWS: View[] = ["dashboard", "announcements", "events", "prayer-times"];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") as View | null;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<View>(
    initialView && VALID_VIEWS.includes(initialView) ? initialView : "dashboard"
  );
  const utils = trpc.useUtils();
  const cached = getCache();
  const mosque = trpc.mosque.getMe.useQuery(undefined, {
    initialData: cached?.mosque ?? undefined,
    initialDataUpdatedAt: cached?.fetchedAt,
  });


  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function handleRefresh() {
    clearCache();
    await utils.mosque.invalidate();
    toast.success("Synced", { duration: 2000 });
  }

  function navigate(v: View) {
    setView(v);
    setSidebarOpen(false);
    const url = v === "dashboard" ? "/dashboard" : `/dashboard?view=${v}`;
    router.replace(url, { scroll: false });
  }

  return (
    <div className="min-h-screen flex font-sans text-mosque-text">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-52 shrink-0 bg-mosque-sidebar flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
          <img src="/logo.png" alt="MyMosque" className="h-7 w-7 rounded-lg" />
          <span className="text-sm font-bold text-white">MyMosque</span>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.view && navigate(item.view)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left w-full ${
                item.view !== null && view === item.view
                  ? `${
                      item.view === "announcements"
                        ? "bg-mosque-green"
                        : item.view === "events"
                        ? "bg-mosque-blue"
                        : item.view === "prayer-times"
                        ? "bg-mosque-purple"
                        : "bg-mosque-green"
                    } text-white`
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div
            className="flex items-center gap-2.5 px-2 mb-2 group cursor-default"
            title={mosque.data?.email ?? ""}
          >
            <div className="w-8 h-8 rounded-full bg-mosque-blue flex items-center justify-center text-white text-xs font-bold select-none shrink-0">
              {mosque.data?.name?.[0]?.toUpperCase() ?? "M"}
            </div>
            <div className="min-w-0">
              <span className="text-xs text-gray-300 font-medium leading-tight block truncate">
                {mosque.data?.name ?? "Loading…"}
              </span>
              <span className="text-[10px] text-gray-500 leading-tight block truncate ">
                {mosque.data?.email ?? ""}
              </span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 bg-mosque-page-bg min-h-screen flex flex-col">

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-30 px-4 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-mosque-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MyMosque" className="h-6 w-6 rounded-lg" />
            <span className="text-sm font-bold text-mosque-text">MyMosque</span>
          </div>
          {view === "dashboard" ? (
            <div className="flex items-center gap-1.5 bg-mosque-purple text-white px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold">Asr</span>
            </div>
          ) : (
            <div className="w-9" />
          )}
        </div>

        {/* VIEW CONTENT */}
        {view === "dashboard"     && <DashboardHome />}
        {view === "announcements" && <AnnouncementsView />}
        {view === "events"        && <EventsView />}
        {view === "prayer-times"  && <PrayerTimesView />}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
