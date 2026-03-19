"use client";

import { useState } from "react";

interface Props {
  event: {
    title: string;
    description: string;
    dateStr: string; // "YYYY-MM-DD"
    timeStr: string; // "HH:MM"
    location: string;
  };
}

export default function EventActions({ event }: Props) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleAddToCalendar() {
    const [h, m] = event.timeStr.split(":").map(Number);
    const dateNoHyphens = event.dateStr.replace(/-/g, "");
    const endH = (h + 1) % 24;
    const start = `${dateNoHyphens}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
    const end = `${dateNoHyphens}T${String(endH).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", event.title);
    url.searchParams.set("dates", `${start}/${end}`);
    url.searchParams.set("details", event.description);
    if (event.location) url.searchParams.set("location", event.location);
    window.open(url.toString(), "_blank");
  }

  const btn =
    "w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer";
  const btnStyle = { backgroundColor: "rgba(0,0,0,0.09)" };
  const btnHoverStyle = { backgroundColor: "rgba(0,0,0,0.14)" };

  return (
    <div className="flex items-center gap-2.5">
      {/* Add to calendar */}
      <button
        onClick={handleAddToCalendar}
        className={btn}
        style={btnStyle}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, btnHoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, btnStyle)}
        title="Add to calendar"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Share / copy link */}
      <button
        onClick={handleShare}
        className={btn}
        style={copied ? { backgroundColor: "rgba(105,154,81,0.22)" } : btnStyle}
        onMouseEnter={(e) => {
          if (!copied) Object.assign(e.currentTarget.style, btnHoverStyle);
        }}
        onMouseLeave={(e) => {
          if (!copied) Object.assign(e.currentTarget.style, btnStyle);
        }}
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? (
          <svg className="w-5 h-5" style={{ color: "var(--mosque-green)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
      </button>
    </div>
  );
}
