import { useEffect, useRef, useState } from "react";
import Backdrop, { SCENES, type SceneId } from "./components/Backdrop";
import Dedicate from "./components/Dedicate";
import InlayCard from "./components/InlayCard";
import Player from "./components/Player";
import Splash from "./components/Splash";
import { songs } from "./data/songs";
import { useYouTube } from "./hooks/useYouTube";
import { readDedication } from "./lib/dedication";

const dedication = readDedication();

// Open on the visitor's own hour: someone in Dubai at 11pm gets the hills at night.
const hour = new Date().getHours();
const startTime = hour < 7 ? "dawn" : hour < 16 ? "day" : hour < 19 ? "dusk" : "night";

const IDLE_MS = 5 * 60 * 1000;

function Chip({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="glass flex h-10 w-10 items-center justify-center rounded-full text-cream/70 transition hover:text-brass"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  );
}

export default function App() {
  const yt = useYouTube(songs, dedication?.song ?? 0);
  const [entered, setEntered] = useState(false);
  const [scene, setScene] = useState<SceneId>("chowrasta");
  const [songsOpen, setSongsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [apiSlow, setApiSlow] = useState(false);
  const fails = useRef(0);

  // Keyboard handlers must see current values without resubscribing every render.
  const ytRef = useRef(yt);
  ytRef.current = yt;

  useEffect(() => {
    document.documentElement.dataset.time = startTime;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.scene = scene;
  }, [scene]);

  // YouTube is blocked on some networks and in some regions. If the API never
  // comes back, let people in anyway — a silent room beats a splash screen that
  // never opens.
  useEffect(() => {
    const t = setTimeout(() => setApiSlow(true), 7000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "Escape") {
        setSongsOpen(false);
        setShareOpen(false);
        return;
      }
      // Never steal keys from a field being typed in, or from a focused control
      // that already handles them — Space on a focused button would fire twice.
      if (el.closest("input, textarea, button, a, [contenteditable]")) return;

      const p = ytRef.current;
      if (e.key === " ") {
        e.preventDefault();
        p.toggle();
      } else if (e.key === "ArrowRight") {
        p.seek(Math.min(p.time + 10, p.duration));
      } else if (e.key === "ArrowLeft") {
        p.seek(Math.max(p.time - 10, 0));
      } else if (e.key === "n") {
        p.next();
      } else if (e.key === "p") {
        p.prev();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [entered]);

  // A song blocked in your region should not become a dead end: skip on, quietly.
  // If the whole tape is blocked where you are, stop trying and say so.
  useEffect(() => {
    if (!yt.error) {
      fails.current = 0;
      return;
    }
    if (fails.current >= songs.length - 1) {
      setBlocked(true);
      return;
    }
    fails.current += 1;
    const t = setTimeout(yt.next, 2600);
    return () => clearTimeout(t);
  }, [yt.error, yt.next]);

  // Sit still long enough and the hills settle. Music keeps playing.
  useEffect(() => {
    if (!entered) return;
    let t: number;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), IDLE_MS);
    };
    wake();
    const events = ["pointerdown", "pointermove", "keydown", "wheel"] as const;
    events.forEach((e) => addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(t);
      events.forEach((e) => removeEventListener(e, wake));
    };
  }, [entered]);

  const message =
    apiSlow && !yt.ready
      ? "यो नेटवर्कबाट युट्युब खुलेन — गीत बज्न सक्दैन।"
      : blocked
        ? "यहाँबाट कुनै पनि गीत बज्दैन — पछि फेरि आउनुहोला।"
        : yt.error
          ? "यो गीत यहाँ बज्दैन — अर्को हालौं?"
          : undefined;

  return (
    <>
      <Backdrop scene={scene} />

      {/* songs and send, kept off the player so the bar stays four controls wide */}
      <div className="fixed top-5 left-5 z-20 flex gap-2 md:top-8 md:left-8">
        <Chip onClick={() => setSongsOpen(true)} label="गीतहरू · Songs">
          <path d="M4 6.5h13M4 12h13M4 17.5h8" />
          <circle cx="18.5" cy="16.5" r="2.5" />
          <path d="M21 16.5V9.5" />
        </Chip>
        <Chip onClick={() => setShareOpen(true)} label="पठाउनुहोस् · Send a song">
          <path d="M4.5 12.2L20 4.5l-4.6 15.4-3-6.2z" />
          <path d="M12.4 13.7L20 4.5" />
        </Chip>
      </div>

      <div className="fixed top-5 right-5 z-20 md:top-8 md:right-8">
        <Chip
          onClick={() =>
            setScene(SCENES[(SCENES.findIndex((s) => s.id === scene) + 1) % SCENES.length].id)
          }
          label={`दृश्य · Scene: ${SCENES.find((s) => s.id === scene)?.en}`}
        >
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 16.5l4.5-4.5 3.5 3.5 3-3 7 7" />
        </Chip>
      </div>

      <Player yt={yt} message={message} />

      <InlayCard
        open={songsOpen}
        onClose={() => setSongsOpen(false)}
        index={yt.index}
        onPick={(i) => {
          yt.jumpTo(i);
          setSongsOpen(false);
        }}
      />

      <Dedicate open={shareOpen} onClose={() => setShareOpen(false)} song={yt.song} />

      {/* five minutes still, and the hills settle */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 grid place-items-center bg-[#0a1610]/80 backdrop-blur-[3px] transition-opacity duration-[2000ms] ${
          idle ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <p className="ne px-8 text-center text-2xl text-cream/70">टाढा भए पनि घर यहीँ छ</p>
      </div>

      <Splash
        open={!entered}
        ready={yt.ready || apiSlow}
        dedication={dedication}
        song={songs[dedication?.song ?? 0]}
        onEnter={() => {
          yt.play(); // must happen inside the tap handler — iOS gesture rule
          setEntered(true);
          // Clear the dedication from the address bar so whatever they share on
          // from here is their own, not a copy of the one they were sent.
          if (dedication) history.replaceState(null, "", location.pathname);
        }}
      />
    </>
  );
}
