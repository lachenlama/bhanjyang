import { useState } from "react";
import type { Song } from "../data/songs";
import { dedicationLink } from "../lib/dedication";

type Props = { open: boolean; onClose: () => void; song: Song };

// A parchi — the paper chit you'd hand across a counter. Two names and a song.

export default function Dedicate({ open, onClose, song }: Props) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const link = dedicationLink(song.id, to, from);
  const text = `${song.titleNe} — ${song.artistNe}\nतपाईंको लागि · a song for you\n${link}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-[#0a1610]/75 p-5 backdrop-blur-[3px]"
      onClick={onClose}
    >
      {/* ponytail: no focus trap — Escape closes it and it's last in the DOM, so
          tabbing works in practice. Add a trap if this grows past two fields. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Send this song to someone"
        className="w-full max-w-sm rotate-[-1.2deg] p-6 text-tea shadow-[0_20px_50px_rgba(0,0,0,.5)]"
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "linear-gradient(90deg, transparent 0 34px, rgba(122,46,42,.3) 34px 35px, transparent 35px)," +
            "repeating-linear-gradient(#f4e8d7 0 29px, rgba(126,168,196,.32) 29px 30px)",
        }}
      >
        <p className="hand text-[13px] text-gumba">पर्ची · a chit</p>
        <h2 className="ne mt-1 text-xl">यो गीत कसैलाई पठाउनुहोस्</h2>
        <p className="font-display text-[13px] text-tea/55 italic">
          Send this song to someone
        </p>

        <p className="hand mt-4 border-y border-tea/15 py-3 text-[17px] leading-snug">
          {song.titleNe}
          <span className="block font-sans text-[12px] text-tea/55 not-italic">
            {song.title} · {song.artist}
          </span>
        </p>

        <label className="mt-4 block">
          <span className="ne text-[13px] text-tea/70">कसलाई · To</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            maxLength={40}
            placeholder="आमा"
            className="hand mt-1 w-full border-b border-tea/30 bg-transparent pb-1 text-[18px] outline-none focus:border-gumba"
          />
        </label>

        <label className="mt-4 block">
          <span className="ne text-[13px] text-tea/70">कसबाट · From</span>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            maxLength={40}
            placeholder="तपाईंको नाम"
            className="hand mt-1 w-full border-b border-tea/30 bg-transparent pb-1 text-[18px] outline-none focus:border-gumba"
          />
        </label>

        <div className="mt-6 flex gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noreferrer"
            className="ne flex-1 rounded-[2px] bg-tea py-3 text-center text-[15px] text-cream"
          >
            ह्वाट्सएपमा
          </a>
          <button
            onClick={copy}
            className="flex-1 rounded-[2px] border border-tea/40 py-3 text-[13px] tracking-[0.06em] uppercase"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        {/* Instagram has no web share intent. Saying so beats a button that lies. */}
        <p className="mt-3 text-[11.5px] leading-relaxed text-tea/50">
          For Instagram, copy the link and paste it in a story or DM.
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-[12px] tracking-[0.08em] text-tea/55 uppercase"
        >
          Close
        </button>
      </div>
    </div>
  );
}
