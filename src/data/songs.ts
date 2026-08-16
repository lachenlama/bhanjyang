export type Group = "ours" | "rain" | "love" | "home" | "selo";

export type Song = {
  id: string;
  yt: string; // YouTube video id
  title: string;
  titleNe: string;
  artist: string;
  artistNe: string;
  group: Group;
};

// "Ours" goes first because the point of the site is that this place made things.
// Empty groups don't render, so these can sit here waiting for songs.
export const GROUPS: { id: Group; ne: string; en: string }[] = [
  { id: "ours", ne: "पहाडको आफ्नै", en: "Ours" },
  { id: "rain", ne: "बर्षा", en: "Rain" },
  { id: "love", ne: "माया", en: "Love" },
  { id: "home", ne: "घर", en: "Home" },
  { id: "selo", ne: "सेलो", en: "Selo" },
];

/*  Every id below was searched for and then opened to confirm it resolves to the
    title claimed here. What that check CANNOT tell you, and what still needs a
    human with a browser:
      - whether embedding is enabled (only fails at runtime, in the player)
      - whether the upload is licensed or a fan re-upload
      - whether it plays in India and Nepal specifically
    Channel confirmed as Music Nepal: pohor-saal, herana-hera, yeti-dherai.
    Channel NOT confirmed, verify before launch: nau-lakh, eh-kancha, chura,
    ramri.

    No `year` field: I could not verify release years for any of these, and a
    wrong date on a heritage site is worse than no date. Add them once someone
    who knows can confirm.

    Devanagari titles for nau-lakh, pohor-saal and herana-hera are taken from the
    video titles themselves. The other four are my transliteration and should be
    checked by a Nepali reader.  */
const base: Song[] = [
  {
    id: "nau-lakh",
    yt: "PhlkhbBwXbI",
    title: "Nau Lakh Tara",
    titleNe: "नौ लाख तारा",
    artist: "Amber Gurung",
    artistNe: "अम्बर गुरुङ",
    group: "ours",
  },
  {
    id: "pohor-saal",
    yt: "8uIaRZrB6Jk",
    title: "Pohor Saal Khusi",
    titleNe: "पोहोर साल खुशी",
    artist: "Aruna Lama",
    artistNe: "अरुणा लामा",
    group: "ours",
  },
  {
    id: "eh-kancha",
    yt: "7pOVG4o7914",
    title: "Eh Kancha Malai Sunko Tara",
    titleNe: "ए कान्छा मलाई सुनको तारा",
    artist: "Aruna Lama",
    artistNe: "अरुणा लामा",
    group: "ours",
  },
  {
    id: "herana-hera",
    yt: "E2A5YLSPliM",
    title: "Herana Hera Kanchha",
    titleNe: "हेर न हेर कान्छा",
    artist: "Aruna Lama & Jitendra Bardewa",
    artistNe: "अरुणा लामा र जितेन्द्र बर्देवा",
    group: "ours",
  },
  {
    id: "yeti-dherai",
    yt: "x7faDV25Dxs",
    title: "Yeti Dherai Maya",
    titleNe: "यति धेरै माया",
    artist: "Narayan Gopal",
    artistNe: "नारायण गोपाल",
    group: "love",
  },
  {
    id: "chura",
    yt: "hXOZ1wFvE0U",
    title: "Chura Ta Hoina Astura",
    titleNe: "चुरा त होइन अस्तुरा",
    artist: "Hira Devi Waiba",
    artistNe: "हीरादेवी वाइबा",
    group: "selo",
  },
  {
    id: "ramri",
    yt: "q7VhB2by7dA",
    title: "Ramri Ta Ramri",
    titleNe: "राम्री त राम्री",
    artist: "Hira Devi Waiba",
    artistNe: "हीरादेवी वाइबा",
    group: "selo",
  },
];

// Phone-testing escape hatch: /?ids=abc123,def456 swaps the playlist without a rebuild.
const override = new URLSearchParams(location.search).get("ids");

export const songs: Song[] = override
  ? override.split(",").map((yt, i) => ({ ...(base[i] ?? base[0]), id: `ov${i}`, yt }))
  : base;
