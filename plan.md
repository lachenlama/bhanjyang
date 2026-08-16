# Bhanjyang — build plan

A single-page audio-visual site for the Gorkha/Nepali hills: an illustrated Darjeeling
scene that breathes, and old Nepali songs playing off a vintage player.

---

## 1. Name

**Bhanjyang** (भञ्ज्याङ) — the saddle of a mountain pass, the place you stop, catch
your breath, drink tea, and talk to strangers before walking on. That is exactly what
this site is. Short, ownable, nobody outside the community uses the word.

Runners-up: **Chiya Guff** (चिया गफ — tea and chatter), **Jhyal** (झ्याल — window).
"Saloon"/"Cassette Club" are borrowed frames; Bhanjyang is ours.

---

## 2. What I cut from the original brief, and why

| In the brief | Verdict | Why |
|---|---|---|
| Next.js | **Vite + React** | No server, no routes, no SSR, no API. Next.js gives you nothing here and costs build time and config. Vite deploys to Vercel identically (static). Supabase later works the same from a Vite client. |
| Framer Motion | **Cut** | Drifting clouds, fluttering flags, rain, steam, a moving train, spinning reels — all are looping CSS keyframes. Framer Motion is for interactive/gesture/layout animation. Add it later *only* if the drawer transition feels wrong. |
| Howler.js **or** YouTube | **YouTube only** | You listed both. You need one. Howler is for files you host, which is exactly what you're (correctly) not doing. |
| Weather toggle as JS state driving animations | **One HTML attribute** | `<html data-weather="rain">`, everything else is CSS. No re-renders, no per-particle JS. |
| Rain as particles | **2 animated gradients** | Two `repeating-linear-gradient` layers translating downward at different speeds = infinite rain, ~0% CPU. 200 divs is not lazier, just heavier. |

Kept as-is: Tailwind, the palette, the fonts, the YouTube-embed-only legal stance, no
backend, placeholder data, Vercel.

---

## 3. Hard truths — read before you write a line

These change what you should build, so decide now, not in week two.

1. **Audio stops when a mobile browser is backgrounded or the phone locks.** An embedded
   YouTube iframe cannot play in the background on iOS or Android web. There is no fix
   that doesn't involve hosting audio, which you've ruled out for good reason. **Accept
   it and design for it**: this is a site you *sit inside* for ten minutes, not a music
   app. Say so on the splash — "keep this window open" — and it becomes charm, not a bug.
2. **YouTube's ToS says don't hide or obscure the player.** A 1×1 offscreen iframe is
   the common workaround and the common gray area. Better idea in §7.
3. **iOS needs a real tap before any playback.** Your splash button covers the first
   play. Auto-advancing to the next song within the same player instance generally
   survives — but *test it on a real iPhone in phase 1*, not at the end.
4. **Ordering.** The brief says start with the background. Don't. **Build the player
   first, ugly.** It is the only part that can fail in a way that changes the whole
   product. Pretty SVG mountains are guaranteed to work; find out about the risky half
   on day one.

---

## 4. Stack

```
Vite + React + TypeScript
TailwindCSS
YouTube IFrame API (loaded from https://www.youtube.com/iframe_api)
Google Fonts: Playfair Display (EN display), Tiro Devanagari Hindi (NE), Inter (body)
Vercel (static, free tier, zero config)
```

No other dependencies. If you reach for one, check §2 first.

---

## 5. File structure

Small on purpose. Every file below earns its place.

```
src/
  main.tsx
  App.tsx                 # splash gate + scene + player, that's the whole app
  data/songs.ts           # the playlist. also the soul of the site (§7.2)
  hooks/useYouTube.ts     # the only complicated code in the project
  components/
    Splash.tsx
    Scene.tsx             # layered SVG background
    WeatherToggle.tsx
    Player.tsx            # cassette deck: transport, seek, volume
    NowPlaying.tsx        # title / artist / year / the story
    Playlist.tsx          # drawer
    Share.tsx
  styles/
    index.css             # tailwind + CSS vars + all @keyframes
```

Component split rule: split when a file gets hard to read, not before. If `Player` and
`NowPlaying` stay under ~120 lines together, keep them together.

---

## 6. Data shape

```ts
// src/data/songs.ts
export type Song = {
  id: string;
  yt: string;        // YouTube video id, official uploads only
  title: string;     // "Simsime Pani"
  titleNe: string;   // "सिमसिमे पानी"
  artist: string;
  year: number;
  note: string;      // 2–3 sentences. see §7.2 — this is the product.
};
```

Placeholder `yt` ids now, real ones later. Nothing else in the app knows where songs
come from, so swapping the array for a Supabase fetch later is a one-file change.

---

## 7. Suggestions to make it better

### 7.1 Dedication links — build this, it's the whole growth engine
Read `?s=<songId>&to=<name>&from=<name>` off the URL on load. If present, the splash
becomes: *"Pratik sent you a song for Aama."* — then it opens straight to that track.
The share button generates the link. Cost: about 15 lines, zero backend. This turns a
website into something people send to their mother on WhatsApp, which is the actual
distribution channel for this audience.

### 7.2 The song notes are the product, not the illustration
Anyone can render mountains. Nobody else can write *"my Bua played this on the Ambassador
tape deck on the road to Mirik, and every time the road curved he'd sing the wrong
words on purpose."* Three lines of real memory per song, in Nepali and English,
credited to whoever contributed it. Write these before you polish a single SVG path.
Fifteen good notes beat fifty songs.

### 7.3 Time-of-day, not just weather
Read the visitor's local hour and set `data-time="dawn|day|dusk|night"` as the default
scene grade. Someone opening this at 11pm in Dubai should get the hills at night.
About five lines of code, and it's the difference between a picture and a place.
Weather toggle stays; it just starts somewhere true.

### 7.4 An ambient bed underneath the music
A quiet loop under everything — rain on a tin roof, a kettle, distant dogs, a monastery
bell. Small CC0 loops from Freesound, hosted by you, entirely legal (this is *your*
audio, not the songs). ~100KB each, plays through the HTML `<audio>` element with
`loop`, ducked to ~15% under the song, and it keeps playing between tracks so silence
never breaks the spell. This is the single biggest atmosphere-per-byte win available.

### 7.5 Make the compliance problem into the art
Instead of hiding the YouTube iframe at 1×1, render it at ~200×200 *inside* the cassette
deck, behind a CSS-masked circular window, spinning-reel graphics overlaid around it.
Visible, compliant, and it looks like the tape is playing. Costs you nothing and removes
a ToS asterisk.

### 7.6 Typography hierarchy: Devanagari first
Song titles in Devanagari large, romanised English small underneath. The community reads
both; leading with Nepali signals immediately who this was made for.

### 7.7 Don't chase illustration detail
Warmth comes from palette, grain, and slow motion — not from vertex count. Six flat SVG
silhouette layers (ridgeline, far hills, tea terraces, pines, stall interior frame,
foreground railing), one shared `feTurbulence` grain overlay, one warm vignette, and a
CSS `filter` per weather state gets you 80% of the saloon.wtf feeling. If you later
want real art, the layer contract is already there to drop PNGs into.

---

## 8. Build order

Each phase ends in something you can open in a browser. Never leave a phase half-done.

**Phase 0 — scaffold (30 min)**
`npm create vite@latest -- --template react-ts`, Tailwind, fonts, CSS variables for the
six palette colours. Nothing visual yet.

**Phase 1 — the risky half (do this first)**
`useYouTube.ts`: load the IFrame API once, create the player, expose
`{ ready, playing, play, pause, next, prev, seek, setVolume, currentTime, duration, index }`.
Poll `getCurrentTime()` on a 500ms interval only while playing. Auto-advance on
`onStateChange === ENDED`. Render it with three ugly HTML buttons and no styling.
**Then open it on a real iPhone and a real Android phone.** Confirm: first play works,
auto-advance works, seek works, volume works on iOS (spoiler: iOS ignores programmatic
volume — hide the volume slider on touch devices rather than shipping a dead control).

**Phase 2 — the scene**
Six SVG layers in `Scene.tsx`, static first. Then add motion one keyframe at a time:
clouds drifting (180s), mist, prayer flags (staggered `nth-child` delays), steam,
the toy train. Make the train *rare* — a 120s loop where it's onscreen for 12 seconds
reads as an event; a constant loop reads as a screensaver.

**Phase 3 — weather + time**
`data-weather` and `data-time` on `<html>`. All CSS. Rain = two translating gradients,
mist = three blurred drifting radial gradients, sun = a slow conic-gradient shaft plus
a warmer scene `filter`.

**Phase 4 — the cassette deck UI**
Style Phase 1's buttons into a real deck. Reels spin only while `playing` (CSS
`animation-play-state`). Seek bar, brass detailing, worn edges.

**Phase 5 — now playing + playlist drawer**
The story card, and the drawer. Both read from `songs.ts`.

**Phase 6 — splash + share + dedications**
Splash with the Nepali one-liner and "keep this window open". Share: copy link,
WhatsApp prefill, Instagram = copy-link-and-tell-them (Instagram has no web share
intent — don't pretend otherwise). Dedication params from §7.1.

**Phase 7 — polish**
`prefers-reduced-motion` freezes ambient motion but keeps the reels. Keyboard: space =
play/pause, arrows = seek/skip. Focus rings that survive the retro styling. Alt text and
`aria-label`s on transport controls. Mobile layout: scene as backdrop, deck docked to
the bottom. Footer: *"All songs belong to their respective owners. This is a
non-commercial tribute."*

**Phase 8 — ship**
`npm run build`, push to GitHub, import on Vercel, framework preset "Vite", done.
No env vars, no serverless functions, no cost.

---

## 9. Not now (Phase 2 of the product)

Guestbook, likes, dedication *storage*, lyrics, listening rooms. All of these want
Supabase. The only thing you must preserve for them is what §6 already gives you:
songs come from one module, and nothing else in the app knows where they live.

---

## 10. Definition of done for the MVP

- Opens on a phone, taps once, hears an old song, sees the hills moving.
- Every song has a story worth reading.
- A dedication link can be sent on WhatsApp and it works.
- Nothing costs money to run.
