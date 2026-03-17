"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
}

export default function EventImage({ src, alt }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-3"
        style={{ background: "linear-gradient(145deg, #f0ede4, #e8e4d8)" }}
      >
        <span style={{ fontSize: "min(8rem, 28vw)", lineHeight: 1 }}>🕌</span>
        <span className="text-sm font-medium text-gray-400">Image unavailable</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  );
}
