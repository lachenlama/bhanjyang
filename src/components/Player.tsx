import type { useYouTube } from "../hooks/useYouTube";

type Props = {
  yt: ReturnType<typeof useYouTube>;
  message?: string;
};

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* The disc is the YouTube iframe, cropped to a circle and turning. It keeps the
   player rendered at full size while reading as the thing that's actually
   playing — one object doing both jobs instead of a hidden frame plus a fake. */
function Disc({ hostRef, playing }: { hostRef: React.RefObject<HTMLDivElement | null>; playing: boolean }) {
  return (
    <div className="relative h-14 w-14 shrink-0 md:h-16 md:w-16">
      {/* The mask is not decoration: Safari drops border-radius clipping on a
          rotating composited child, and the video's square corners show through. */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ WebkitMaskImage: "radial-gradient(circle, #fff 99%, transparent 100%)" }}
      >
        <div className={`absolute inset-0 ${playing ? "disc" : ""}`}>
          <div
            ref={hostRef}
            className="ytHost absolute top-1/2 left-1/2 h-[164px] w-[292px] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
      {/* sheen and spindle sit still while the disc turns under them */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, transparent 26%, rgba(6,12,9,.45) 78%)" }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-cream/20 ring-inset" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0d1712] ring-1 ring-cream/25 md:h-3.5 md:w-3.5" />
    </div>
  );
}

export default function Player({ yt, message }: Props) {
  const pct = yt.duration > 0 ? Math.min(100, (yt.time / yt.duration) * 100) : 0;

  return (
    <section className="bar" aria-label="Player">
      {message && (
        <p className="ne mb-2 px-4 text-center text-[12px] text-[#e2a49f]" role="status">
          {message}
        </p>
      )}

      <div className="glass rounded-[20px] px-3 py-2.5 md:px-4 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <Disc hostRef={yt.hostRef} playing={yt.playing} />

          <div className="min-w-0 flex-1">
            <h2 className="ne truncate text-[15px] leading-tight text-cream md:text-[17px]">
              {yt.song.titleNe}
            </h2>
            <p className="truncate font-display text-[11px] text-cream/45 italic md:text-[12.5px]">
              {yt.song.title} · {yt.song.artist}
            </p>
          </div>

          <div className="flex shrink-0 items-center">
            <Key label="अघिल्लो गीत" onClick={yt.prev} disabled={!yt.ready}>
              <path d="M6.5 5.5v13M18.5 5.8v12.4L9.2 12z" />
            </Key>
            <Key
              label={yt.playing ? "रोक्नुहोस्" : "सुरु"}
              onClick={yt.toggle}
              disabled={!yt.ready}
              big
            >
              {yt.playing ? <path d="M9 5.5v13M15 5.5v13" /> : <path d="M7.5 5.2v13.6L19 12z" />}
            </Key>
            <Key label="अर्को गीत" onClick={yt.next} disabled={!yt.ready}>
              <path d="M17.5 5.5v13M5.5 5.8v12.4L14.8 12z" />
            </Key>
          </div>

          <span className="hidden shrink-0 text-[11px] tabular-nums text-cream/35 md:inline">
            {mmss(yt.time)} / {mmss(yt.duration)}
          </span>
        </div>

        {/* hairline progress: painted bars under a transparent native input, so
            dragging, arrow keys and screen readers all still work */}
        <div className="group relative mt-2.5 flex h-3 items-center px-0.5">
          <div className="absolute inset-x-0.5 h-px bg-cream/15" />
          <div className="absolute left-0.5 h-px bg-brass/80" style={{ width: `${pct}%` }} />
          <span
            className="absolute h-[6px] w-[6px] rounded-full bg-brass opacity-0 transition group-hover:opacity-100"
            style={{ left: `calc(${pct}% - 3px)` }}
          />
          <input
            type="range"
            className="bare absolute inset-0 w-full"
            min={0}
            max={yt.duration || 1}
            step={1}
            value={yt.time}
            onChange={(e) => yt.seek(Number(e.target.value))}
            disabled={!yt.ready}
            aria-label="Seek through the song"
          />
        </div>
      </div>
    </section>
  );
}

function Key({
  children,
  label,
  onClick,
  disabled,
  big,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex items-center justify-center rounded-full text-cream/75 transition hover:text-brass disabled:opacity-30 ${
        big ? "h-11 w-11" : "h-9 w-9"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={big ? "h-[21px] w-[21px]" : "h-4 w-4"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  );
}
