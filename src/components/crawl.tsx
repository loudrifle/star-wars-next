"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CRAWL_TEXT = [
  "It is a time of great adventure. Across the galaxy, countless worlds hold stories waiting to be discovered.",
  "From the deserts of Tatooine to the ice fields of Hoth, from the forests of Endor to the swamps of Dagobah — each planet harbors its own secrets.",
  "Brave heroes and fearsome villains alike have shaped the destiny of the galaxy. Their names echo through history: Skywalker, Vader, Solo, Kenobi.",
  "Now, a new explorer arises. One who seeks not conquest, but knowledge.",
  "You have entered the GALAXY EXPLORER — your guide to the complete Star Wars universe...",
];

export function Crawl() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="crawl-scene">
        <div className="crawl-stars" />
        <div className="crawl-intro">
          <p
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              color: "#ffe81f",
              letterSpacing: "0.3em",
              fontSize: "0.75rem",
            }}
          >
            A long time ago in a galaxy far, far away....
          </p>
          <button
            onClick={() => setStarted(true)}
            className="flex items-center gap-2 border border-[#ffe81f]/40 text-[#ffe81f] px-8 py-3 hover:bg-[#ffe81f]/10 transition-all rounded"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              letterSpacing: "0.3em",
              fontSize: "1rem",
            }}
          >
            BEGIN
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="crawl-scene">
      <div className="crawl-stars" />
      <div className="crawl-top-fade" />
      <div className="crawl-perspective">
        <div className="crawl-content">
          {/* Episode label */}
          <p
            className="text-center mb-4"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              color: "#ffe81f",
              letterSpacing: "0.25em",
              fontSize: "1rem",
            }}
          >
            GALAXY EXPLORER
          </p>

          {/* Main title */}
          <h1
            className="text-center mb-8"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              color: "#ffe81f",
              letterSpacing: "0.15em",
              fontSize: "3.5rem",
              lineHeight: 1,
            }}
          >
            STAR WARS
          </h1>

          {/* Horizontal rule */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, transparent, #c8a84b, transparent)",
              marginBottom: "2rem",
            }}
          />

          {/* Crawl paragraphs */}
          {CRAWL_TEXT.map((para, i) => (
            <p
              key={i}
              className="mb-5 text-center"
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue')",
                color: "#ffe81f",
                fontSize: "1.05rem",
                letterSpacing: "0.08em",
                lineHeight: 1.7,
              }}
            >
              {para}
            </p>
          ))}

          {/* CTA */}
          <div className="flex justify-center mt-10">
            <Link
              href="/films"
              className="flex items-center gap-2 border border-[#ffe81f]/60 text-[#ffe81f] px-8 py-3 hover:bg-[#ffe81f]/10 transition-all rounded"
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue')",
                letterSpacing: "0.3em",
                fontSize: "1rem",
              }}
            >
              ENTER THE GALAXY
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <div className="crawl-bottom-fade" />
    </div>
  );
}
