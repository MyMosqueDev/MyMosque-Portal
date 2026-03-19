import { notFound } from "next/navigation";
import { serverCaller } from "@/trpc/server";
import EventActions from "./EventActions";
import EventImage from "./EventImage";

function formatDateLong(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatTime(date: Date) {
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${ampm}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await serverCaller.mosque.getEvent({ id: Number(id) });
  if (!event) notFound();

  const dateStr = event.date.toISOString().split("T")[0];
  const timeStr = event.date.toISOString().split("T")[1].slice(0, 5);
  const initials = event.host ? getInitials(event.host) : "";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/event-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* Nav */}
      <nav className="flex items-center px-6 md:px-14 py-5">
        <a href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="MyMosque" className="w-7 h-7 object-contain" />
          <span className="font-bold text-gray-900 text-base tracking-tight">MyMosque</span>
        </a>
      </nav>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 md:px-14 pb-20 pt-4 md:pt-10">
        <div className="flex flex-col md:grid md:grid-cols-[1fr_400px] gap-10 md:gap-20 items-start">

          {/* ── Left: details ─────────────────────────────── */}
          <div className="order-2 md:order-1">

            {/* Title */}
            <h1
              className="font-black text-gray-950 leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}
            >
              {event.title}
            </h1>

            {/* Date & Time */}
            <div className="mb-7">
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatDateLong(event.date)}
              </p>
              <p className="text-lg text-gray-600 mt-0.5">{formatTime(event.date)}</p>
            </div>

            {/* Action icon buttons */}
            <EventActions
              event={{
                title: event.title,
                description: event.description,
                dateStr,
                timeStr,
                location: event.location,
              }}
            />

            {/* Hosted by */}
            {event.host && (
              <div className="mt-9">
                <div className="flex items-center gap-1.5 mb-3">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.5 19h19l-1.5-9-6 4.5L12 8l-2 6.5L4 10l-1.5 9zm10-19C11.17 0 10.5.67 10.5 1.5S11.17 3 12 3s1.5-.67 1.5-1.5S12.83 0 12 0z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                    Hosted by
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--mosque-blue) 0%, var(--mosque-purple) 100%)",
                    }}
                  >
                    {initials}
                  </div>
                  <span className="font-semibold text-gray-900 text-base">{event.host}</span>
                </div>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="mt-6 flex items-center gap-2.5 text-gray-700">
                <svg
                  className="w-5 h-5 shrink-0 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium text-base">{event.location}</span>
              </div>
            )}

            {/* Description */}
            <p className="mt-7 text-gray-700 text-base leading-relaxed" style={{ maxWidth: "42ch" }}>
              {event.description}
            </p>
          </div>

          {/* ── Right: image ──────────────────────────────── */}
          <div className="order-1 md:order-2 w-full">
            <div
              className="w-full rounded-3xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: "1 / 1" }}
            >
              <EventImage src={event.image} alt={event.title} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
