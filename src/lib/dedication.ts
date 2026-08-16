import { songs } from "../data/songs";

// A song sent from one person to another, carried entirely in the URL.
// No backend, no storage, no account — the link is the whole record.

export type Dedication = { song: number; to: string; from: string };

// Names arrive from a URL a stranger can write, so cap them. React escapes the
// text; the cap is only so nobody can shove the layout off the screen.
const name = (s: string | null) => (s ?? "").trim().slice(0, 40);

export function readDedication(): Dedication | null {
  const p = new URLSearchParams(location.search);
  const id = p.get("s");
  if (!id) return null;
  const song = songs.findIndex((x) => x.id === id);
  if (song < 0) return null;
  return { song, to: name(p.get("to")), from: name(p.get("from")) };
}

export function dedicationLink(songId: string, to: string, from: string) {
  const u = new URL(location.origin + location.pathname);
  u.searchParams.set("s", songId);
  if (name(to)) u.searchParams.set("to", name(to));
  if (name(from)) u.searchParams.set("from", name(from));
  return u.toString();
}
