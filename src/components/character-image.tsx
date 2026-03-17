"use client";

import Image from "next/image";
import { useState } from "react";

interface CharacterImageProps {
  src: string;
  alt: string;
}

export function CharacterImage({ src, alt }: CharacterImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[var(--color-sw-muted)]">
        <span
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue')",
            fontSize: "2rem",
            opacity: 0.3,
          }}
        >
          ?
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={200}
      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
      onError={() => setFailed(true)}
    />
  );
}
