# Bhanjyang — design direction

A nostalgic audio-visual room for the Nepali-speaking hills: Darjeeling, Kurseong,
Kalimpong, Mirik, Sikkim, and everyone who left.

---

## 0. Three corrections before anything else

**Drop "Saloon."** In hill English, a *saloon* is where you get a haircut — every town
has a New Style Saloon with a hand-painted sign. To the actual audience, "Pahad Saloon"
reads as a barbershop. The word only works if you've seen saloon.wtf, and nobody's aama
has. Use **Bhanjyang** (भञ्ज्याङ) — the saddle of a pass, where you stop, drink tea, and
talk to strangers before walking on. Nobody has to have it explained to them.

**The toy train is blue, not red.** The DHR B-class locos are famously blue. This is the
kind of detail the audience notices in half a second and the rest of the internet never
does. Getting it right is most of the trust.

**This is Darjeeling, not Nepal.** The doc drifts toward Radio Nepal. The radio of these
hills is **Akashvani Kurseong** — All India Radio's Nepali service, broadcast from a
ridge above the tea gardens, and for generations *the* voice in every kitchen. Nepal is
where the language came from; Kurseong is where the childhood happened. Getting this
backwards is the difference between "made for us" and "made about us."

---

## 1. The emotion

**घर याद आयो.** Not sadness — the particular ache of remembering somewhere warm while
you're somewhere else. The visitor is very likely reading this on a phone in Bengaluru,
Delhi, Dubai, or Sydney, at night, alone.

The site is not a music app. It's a window. You are inside somewhere warm and small,
and the hills are outside, and it's raining. That's the whole idea, and every decision
below serves it.

Everything slows the visitor down. If a screen makes them feel efficient, it's wrong.

---

## 2. Commit to one scene: inside, looking out

The old draft offered an outdoor scene or an indoor one and left it open. Decide:
**indoor, with a window.** Reasons:

- The window *is* the diaspora experience. They're already looking at home through a
  pane of glass; the site just makes the glass literal.
- Rain needs something to run down. Outdoors, rain is weather; on a window, it's a mood.
- The cassette player needs a table to sit on. Floating UI over a landscape always
  looks like an app pasted onto a wallpaper.
- One scene is half the work and twice as good.

**Inside:** unpainted wooden wall, a small table, a kettle, a cassette deck, one warm
bulb. On the wall, a faded photo and a calendar with the month curling at the corner.

**Outside the window:** the Kanchenjunga range — which people here call the **Sleeping
Buddha**, so the silhouette should actually read as a reclining figure, not just peaks.
Below it, tea slopes in contour rows, pines, tin roofs stacked down the hillside, and a
line of prayer flags across the top of the frame.

**Things that move:** clouds crossing (190s and 260s, two layers), mist rising and
settling (70–120s), flags fluttering (2.6s, staggered), steam off the glass of tea
(4.5s), and the toy train — 12 seconds of travel inside a 120-second loop, so it's an
event you catch, not a treadmill. If everything moves at once it's a screensaver. Most
of the frame should be still most of the time.

**Weather:** rain, mist, sun. Rain is the default emotionally, but **mist** is the
default visually — *kuiro lagyo* is the hills' resting state.

**Time of day follows the visitor's clock, not ours.** Someone opening this at 11pm in
Dubai gets the hills at night, lamp on, blue-black glass. Already built.

---

## 3. The tin roof

The most Darjeeling material in the world is corrugated tin — rusted orange-brown,
stacked down every hillside, and the reason rain in the hills has a *sound* rather than
a look. It's missing from the palette and from the scene, and it shouldn't be.

Add rust to the palette. Put tin roofs in the middle distance. And when the ambient
bed goes in, make rain-on-tin the first loop you record or source. That single sound
does more emotional work than any illustration in this document.

---

## 4. Palette

| Name | Hex | Where |
|---|---|---|
| Tea green | `#1E3D2F` | interior shadow, base ground |
| Himalayan blue | `#7EA8C4` | distant range, mist, daylight sky |
| Gumba red | `#7A2E2A` | prayer flag, sill, accents |
| Brass | `#C9A227` | active states, knobs, the playing song |
| Warm cream | `#F4E8D7` | text on dark, paper, steam |
| Kuiro grey | `#D8D8D8` | fog, secondary text |
| Lamp warm | `#E8B66B` | the bulb, the glow behind the deck |
| **Tin rust** | `#9C5B3B` | roofs, worn metal, the deck's chassis |

The reference isn't "Himalayan tourism brochure." It's a **Nepali cassette inlay card
from 1986**: two-colour offset printing, slightly off-register, ink soaked into cheap
paper, one colour bleeding a hair past its edge. Build that in — a 1px colour offset on
headings, visible grain, edges that aren't perfectly crisp. Perfection reads as
corporate; misregistration reads as *held*.

Avoid: pure white, pure black, any gradient that looks like a mobile banking app.

---

## 5. Type

**Devanagari leads. Roman follows.** Song titles set large in Devanagari with the
romanisation smaller underneath. The community reads both — leading with Nepali
announces immediately who this was made for, before a single word is read.

- **Devanagari display:** Tiro Devanagari Hindi. Warm, pen-drawn, not a UI font.
- **Latin display:** *change this from Playfair.* Playfair is a high-contrast fashion
  serif; next to Tiro's even calligraphic stroke it looks like a different project.
  Use **Gelasio**, **Crimson Pro**, or **Source Serif 4** — low contrast, same hand.
- **Body:** Inter or Mukta. Mukta if you want one family across both scripts.
- **Small labels:** Inter, uppercase, `letter-spacing: 0.08em`.

Two things that will actually bite you:

- Devanagari needs **line-height ≥ 1.6**. Below that the matras and shirorekha collide
  and it looks broken to anyone who reads the script — and fine to anyone who doesn't.
- Test with real conjuncts — क्ष, त्र, ज्ञ, ङ्ग — not with placeholder text. Half of the
  free Devanagari fonts fall apart on them.

---

## 6. The cassette deck

An object, not a control bar. Bottom-right on desktop; a bottom sheet you can drag up
on mobile.

Rust-brown chassis, brass trim, cream-printed labels, corners worn lighter where
thumbs went. Two reels that turn **only while audio is actually playing** — a spinning
reel over a paused song is a lie, and it's the kind of lie that breaks the spell.

**The YouTube iframe lives inside the tape window.** Rather than hiding it at 1×1 —
which is both a ToS grey area and a waste — render it small behind a circular mask
where the tape would be, reels overlaid around it. The compliance problem becomes the
one moving detail in the middle of the deck.

Controls: play, pause, previous, next, a seek line that looks like tape counter travel,
and a brass volume knob **on desktop only** — iOS ignores programmatic volume, and a
knob that does nothing is worse than no knob.

Label buttons in Nepali (सुरु, रोक्नुहोस्, अघिल्लो, अर्को) — but **no tooltips**. Tooltips
don't exist on touch, which is where most of this audience lives. Icon plus a small
Devanagari label, always visible.

When a track starts, a hand-lettered cassette label slides across for two seconds:
*Side A — अरुणा लामा*. This is the best idea in the original document. Keep it exactly.

Pick **one** reactive light — the warm glow behind the deck — and drop the VU meter and
the flickering bulb. Three things pulsing at once is a slot machine.

---

## 7. The playlist is a handwritten inlay card

Not a wooden shelf and not a list of rows. Anyone who bought a dubbed cassette in a hill
music shop remembers the **inlay card filled in by hand in ballpoint** — song titles in
a shopkeeper's slanted Devanagari, numbered, sometimes misspelt, sometimes running off
the edge. That's the drawer.

Practically: cream card stock, ruled lines, numbers in a column, current track marked
with a brass underline. You do not need real handwriting — a slight rotation per line
(±0.4°) and an irregular left margin gets you most of the way.

**Group by feeling, not genre:**

- **पहाडको आफ्नै** / *Ours* — Aruna Lama, Amber Gurung, Gopal Yonzon, Karma Yonzon,
  Hira Devi Waiba. Musicians from these hills. This group goes first, because the point
  of the site is that this place made things.
- **बर्षा** / *Rain* — monsoon, tin roofs, waiting.
- **माया** / *Love* — the old ones.
- **घर** / *Home* — leaving, and not coming back yet.
- **सेलो** / *Selo* — Tamang Selo and folk. Note: the instrument here is the **damphu**,
  not the madal. Use a damphu for the icon.

*Verify the artist list with people from the hills before launch — I've placed these
from general knowledge, and the canon belongs to the community, not to a document.*

---

## 8. The song stories — this is the actual product

Anyone can draw mountains. The thing nobody else can build is three sentences of true
memory attached to a song.

> "Bua played this in the Ambassador on the road to Mirik, and every time the road
> curved he sang the wrong words on purpose. I was carsick the whole way. I'd take the
> drive again."

Rules that make these work:

- **2–3 sentences. Never more.** A paragraph becomes an article and people stop reading.
- **English carrying Nepali words** — *chiya*, *bua*, *jhyal*, *kuiro* — untranslated
  and unitalicised. Italics turn your own language into a foreign object. The diaspora
  reads this way naturally; outsiders get it from context or don't, and that's fine.
- **One concrete physical detail** each: a smell, a road, an object, a wrong lyric.
  Abstractions ("this song reminds us of home") are worthless. Specifics travel.
- **Credit the person, with the journey:** *— Pemba, Kalimpong → Bengaluru.* That arrow
  is the whole site in one character.

Fifteen songs with real stories beat fifty with none. Write these before polishing a
single SVG path.

---

## 9. What this site never does

As load-bearing as anything above:

- No sound before a tap. Ever.
- No cookie banner — because no cookies, no analytics, no tracking. Say so in the footer
  and mean it.
- No login, no email capture, no newsletter modal, no "share to unlock."
- No infinite scroll, no recommendations, no autoplay of a "similar" song.
- No spinner. While things load, the hills assemble layer by layer — sky, ridge, hills,
  pines. Loading becomes dawn.
- **No politics.** No flags, no slogans, no map, no Gorkhaland. Not because it doesn't
  matter — because for a lot of visitors 2017 means closed schools and a shut-down
  summer, and this room is meant to be the one place that isn't about that. Keep it at
  *ghar*, never at *statehood*. If someone opens this and feels argued with, it has
  failed at the only thing it was for.

One nuance in the same spirit: "Gorkha" names a community that includes Tamang, Rai,
Limbu, Gurung, Newar, Sherpa, Bhutia, Kami, Damai, Sarki — and the Lepcha, who were
here first. The thread holding it together is the **language**, not any one group. So
the site's identity should sit on Nepali, chiya, kuiro and the hills, never on one
ethnicity's iconography.

---

## 10. Small things that carry weight

Keep, because they're cheap and they land:

- Hover the window → mist thickens slightly.
- Tap the cup → one puff of steam. (Fine on touch. A hover-only easter egg isn't.)
- Idle five minutes → the room dims toward night, music continuing, and one line settles
  over the glass: **टाढा भए पनि घर यहीँ छ** — *even far away, home is here.*

Cut:

- Custom tea-leaf cursor. The original document already talks itself out of this.
  Cursors are for pointing.
- The toy train whistle on click. A whole second audio path for one gag; revisit after
  the ambient bed exists, if ever.

Motion discipline: nothing under 300ms except button feedback; fades 800ms–1.2s;
ambient loops 70s and up; and **`prefers-reduced-motion` freezes the weather but never
the reels**, because the reels are information.

---

## 11. Mobile is the primary design

Most of this audience is on a mid-range Android phone on mobile data. Design there
first and let desktop be the generous version.

- The scene keeps the top ~55% of the screen and never shrinks to a strip. It's the
  emotional core, not a header image.
- The deck is a bottom sheet: collapsed shows reels, title, play/pause. Dragged up
  shows seek, the story, and the inlay card.
- Weather is one small icon, top-right, cycling sun → mist → rain.
- Thumb targets ≥ 44px, and everything reachable in the bottom third.
- Cream on tea green passes contrast comfortably; check brass on cream, which does not
  at small sizes — use brass for borders and fills, not for body text.

**Say the quiet part on the splash.** Embedded YouTube audio stops when a phone locks —
there's no way around it without hosting files. So tell them warmly, in the splash copy:
*"बत्ती नबन्द गर्नुहोला — keep this window open."* A limitation you name becomes part of
the room's character. One you hide becomes a bug report.

---

## 12. When a song won't play

This will happen constantly and the original document has no answer for it. Label and
regional blocks mean a video that plays in Siliguri may be dead in Dubai — which is
exactly where your audience is.

So never show `Error 150`. Show:

> **यो गीत यहाँ बज्दैन** — this one won't play from where you are. Shall we put on the
> next?

...and auto-advance after a moment. The room stays warm even when the tape sticks.

---

## 13. Splash

Dark, misty, still. A single line drawing — a glass of chiya, steam rising — not a cup;
hill stalls serve tea in small glasses, and everyone from there knows the difference.

**भञ्ज्याङ**, small Roman *Bhanjyang* beneath.

Then the tagline, which should be one plain sentence in Nepali with an English line
under it. Candidates:

- पुराना गीत, पहाडको माया
- यहाँ अझै पुराना गीत बज्छ — *here, the old songs still play*
- घर टाढा छ, गीत छेउमै — *home is far, the songs are close*

*Pick these with native speakers.* Written Nepali carries register the way English
carries accent, and the hills' spoken Nepali is not Kathmandu broadcast Nepali. A line
that's a shade too formal will read as an outsider's site to the exact people it's for.
This is the one part of the design I'd hand entirely to someone from there.

Button: **भित्र आउनुहोस्** / *Come in*. Not "Enter" — you enter a building; you come into
a home.

Fade out like fog lifting, 1.2s, not a slide or a wipe.

---

## 14. Footer

> हाम्रो पहाड, हाम्रो गीत, हाम्रो माया।
>
> Built for the Nepali-speaking hills — Darjeeling, Kurseong, Kalimpong, Mirik, Sikkim,
> and wherever you're reading this from. No tracking, no accounts, nothing stored.
> All songs belong to their respective owners. A non-commercial tribute.

---

## 15. The test

Show it to one person from the hills who is currently living somewhere else. Say
nothing. If they go quiet, it works. If they start scrolling, it doesn't.
