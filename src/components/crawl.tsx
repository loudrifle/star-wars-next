"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CRAWL_TEXT = [
  "It is a time of great adventure. Across the galaxy, countless worlds hold stories waiting to be discovered.",
  "From the deserts of Tatooine to the ice fields of Hoth, from the forests of Endor to the swamps of Dagobah — each planet harbors its own secrets.",
  "Brave heroes and fearsome villains alike have shaped the destiny of the galaxy. Their names echo through history: Skywalker, Vader, Solo, Kenobi.",
  "Now, a new explorer arises. One who seeks not conquest, but knowledge.",
  "You have entered the GALAXY EXPLORER — your guide to the complete Star Wars universe...",
];

// Duration must match crawlRoll in globals.css
const CRAWL_DURATION_MS = 20_000;

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const maybeCanvas = canvasRef.current;
    if (!maybeCanvas) return;
    const maybeCtx = maybeCanvas.getContext("2d");
    if (!maybeCtx) return;
    // Re-assign with explicit non-nullable types so closures below don't re-widen
    const canvas: HTMLCanvasElement = maybeCanvas;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    interface Star {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      speed: number;
      phase: number;
    }

    let stars: Star[] = [];
    let raf: number;
    let frame = 0;

    function buildStars(w: number, h: number) {
      stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.15 ? 1.8 : Math.random() < 0.4 ? 1.1 : 0.6,
        baseAlpha: Math.random() * 0.45 + 0.35,
        speed: Math.random() * 0.018 + 0.004,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildStars(canvas.width, canvas.height);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const alpha = s.baseAlpha * (0.65 + 0.35 * Math.sin(frame * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }
      frame++;
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="crawl-canvas" />;
}

export function Crawl() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  // Auto-navigate when crawl finishes — no dead black-screen wait
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => { router.push("/home"); }, CRAWL_DURATION_MS);
    return () => { clearTimeout(t); };
  }, [started, router]);

  if (!started) {
    return (
      <div className="crawl-scene">
        <StarCanvas />
        <div className="crawl-intro">
          <p
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              color: "#ffe81f",
              letterSpacing: "0.08em",
              fontSize: "clamp(0.95rem, 3vw, 1.35rem)",
              fontStyle: "italic",
              width: "100%",
            }}
          >
            A long time ago in a galaxy far, far away....
          </p>
          <button
            onClick={() => { setStarted(true); }}
            className="group flex items-center gap-3 border border-[#ffe81f]/60 text-[#ffe81f] px-10 py-4 rounded transition-all duration-300 hover:bg-[#ffe81f]/10 hover:border-[#ffe81f] hover:shadow-[0_0_40px_rgba(255,232,31,0.2)] hover:scale-105 hover:cursor-pointer active:scale-95"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              letterSpacing: "0.4em",
              fontSize: "clamp(0.95rem, 3vw, 1.4rem)",
            }}
          >
            BEGIN
            <ChevronRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          <Link
            href="/home"
            className="group flex items-center gap-3 border border-[#ffe81f]/60 text-[#ffe81f] px-10 py-4 rounded transition-all duration-300 hover:bg-[#ffe81f]/10 hover:border-[#ffe81f] hover:shadow-[0_0_40px_rgba(255,232,31,0.2)] hover:scale-105 cursor-pointer"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              letterSpacing: "0.4em",
              fontSize: "clamp(0.95rem, 3vw, 1.4rem)",
            }}
          >
            SKIP INTRO
            <ChevronRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="crawl-scene">
      <StarCanvas />
      <div className="crawl-top-fade" />
      <div className="crawl-perspective">
        <div className="crawl-content">
          <p
            className="text-center mb-4"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              color: "#ffe81f",
              letterSpacing: "0.35em",
              fontSize: "clamp(0.85rem, 2.5vw, 1.5rem)",
            }}
          >
            GALAXY EXPLORER
          </p>

          <h1
            className="text-center mb-8"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue')",
              color: "#ffe81f",
              letterSpacing: "0.1em",
              fontSize: "clamp(3.5rem, 13vw, 6rem)",
              lineHeight: 1,
            }}
          >
            STAR WARS
          </h1>

          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, #c8a84b 35%, #c8a84b 65%, transparent)",
              marginBottom: "2.5rem",
            }}
          />

          {CRAWL_TEXT.map((para, i) => (
            <p
              key={i}
              className="mb-7 text-center"
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue')",
                color: "#ffe81f",
                fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
                letterSpacing: "0.07em",
                lineHeight: 1.85,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
      <div className="crawl-bottom-fade" />

      {/* persistent enter button — always accessible during the crawl */}
      <Link
        href="/home"
        className="crawl-enter-btn group flex items-center gap-2"
      >
        ENTER THE GALAXY
        <ChevronRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
