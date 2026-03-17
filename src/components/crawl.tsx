"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CRAWL_TEXT = [
  "It is a time of great adventure. Across the galaxy, countless worlds hold stories waiting to be discovered.",
  "From the deserts of Tatooine to the ice fields of Hoth, from the forests of Endor to the swamps of Dagobah — each planet harbors its own secrets.",
  "Brave heroes and fearsome villains alike have shaped the destiny of the galaxy. Their names echo through history: Skywalker, Vader, Solo, Kenobi.",
  "Now, a new explorer arises. One who seeks not conquest, but knowledge.",
  "You have entered the GALAXY EXPLORER — your guide to the complete Star Wars universe...",
];

export function Crawl() {
  const [started, setStarted] = useState(false);
  const [settled, setSettled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started) return;

    const el = contentRef.current;
    if (!el) return;

    function handleAnimationEnd() {
      setSettled(true);
    }

    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
  }, [started]);

  if (!started) {
    return (
      <div className="crawl-scene">
        <div className="crawl-stars" />
        <div className="crawl-intro">
          <p
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              color: "#ffe81f",
              letterSpacing: "0.35em",
              fontSize: "1.5rem",
            }}
          >
            A long time ago in a galaxy far, far away....
          </p>
          <button
            onClick={() => setStarted(true)}
            className="group flex items-center gap-3 border border-[#ffe81f]/50 text-[#ffe81f] px-12 py-4 rounded transition-all duration-300 hover:bg-[#ffe81f]/15 hover:border-[#ffe81f] hover:shadow-[0_0_30px_rgba(255,232,31,0.25)] hover:scale-105 hover:cursor-pointer active:scale-95"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              letterSpacing: "0.4em",
              fontSize: "1.4rem",
            }}
          >
            BEGIN
            <ChevronRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    );
  }

  const content = (
    <>
      <p
        className="text-center mb-4"
        style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue')",
          color: "#ffe81f",
          letterSpacing: "0.35em",
          fontSize: "1.6rem",
        }}
      >
        GALAXY EXPLORER
      </p>

      <h1
        className="text-center mb-8"
        style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue')",
          color: "#ffe81f",
          letterSpacing: "0.15em",
          fontSize: "6rem",
          lineHeight: 1,
        }}
      >
        STAR WARS
      </h1>

      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, #c8a84b, transparent)",
          marginBottom: "2rem",
        }}
      />

      {CRAWL_TEXT.map((para, i) => (
        <p
          key={i}
          className="mb-6 text-center"
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue')",
            color: "#ffe81f",
            fontSize: "1.85rem",
            letterSpacing: "0.08em",
            lineHeight: 1.8,
          }}
        >
          {para}
        </p>
      ))}

      <div className="flex justify-center mt-12 pb-16">
        <Link
          href="/films"
          className="group flex items-center gap-3 border border-[#ffe81f]/60 text-[#ffe81f] px-12 py-4 rounded transition-all duration-300 hover:bg-[#ffe81f]/15 hover:border-[#ffe81f] hover:shadow-[0_0_30px_rgba(255,232,31,0.25)] hover:scale-105 cursor-pointer"
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue')",
            letterSpacing: "0.4em",
            fontSize: "1.4rem",
          }}
        >
          ENTER THE GALAXY
          <ChevronRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </>
  );

  if (settled) {
    return (
      <div className="crawl-scene" style={{ overflowY: "auto", justifyContent: "flex-start" }}>
        <div className="crawl-stars" />
        <div className="crawl-settled-content">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="crawl-scene">
      <div className="crawl-stars" />
      <div className="crawl-top-fade" />
      <div className="crawl-perspective">
        <div ref={contentRef} className="crawl-content">
          {content}
        </div>
      </div>
      <div className="crawl-bottom-fade" />
    </div>
  );
}
