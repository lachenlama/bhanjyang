import { GROUPS, songs, type Group } from "../data/songs";
import { SONG_REQUEST_URL } from "../lib/config";

type Props = {
  open: boolean;
  onClose: () => void;
  index: number;
  onPick: (i: number) => void;
};

// Line icons, drawn small. The Selo mark is a damphu — the Tamang frame drum —
// not a madal.
const ICONS: Record<Group, React.ReactNode> = {
  ours: <path d="M2 19l7-11 4 6 3-4 6 9z" />,
  rain: (
    <>
      <path d="M2 12a10 10 0 0 1 20 0z" />
      <path d="M12 12v6.5a2.5 2.5 0 0 0 4 2" />
    </>
  ),
  love: <path d="M12 20S4 15 4 10a4.4 4.4 0 0 1 8-2.7A4.4 4.4 0 0 1 20 10c0 5-8 10-8 10z" />,
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  selo: (
    <>
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="2.4" />
      <path d="M15.2 15.2L21 21" />
    </>
  ),
};

export default function InlayCard({ open, onClose, index, onPick }: Props) {
  return (
    <aside
      className="inlay z-30 flex flex-col text-tea shadow-[0_0_60px_rgba(0,0,0,.6)]"
      data-open={open}
      /* Slid offscreen is still in the tab order without this — you'd tab into a
         drawer nobody can see. */
      inert={!open}
      style={{
        // ruled card stock, with the red margin rule down the left
        background:
          "linear-gradient(90deg, transparent 0 40px, rgba(122,46,42,.35) 40px 41px, transparent 41px)," +
          "repeating-linear-gradient(#f4e8d7 0 31px, rgba(126,168,196,.35) 31px 32px)",
      }}
    >
      <header className="flex items-start justify-between border-b border-tea/15 px-6 pt-6 pb-4">
        <div>
          <p className="hand text-[13px] text-gumba">भञ्ज्याङ — Side A / Side B</p>
          <h2 className="ne text-2xl">गीतहरू</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-[2px] border border-tea/25 px-3 py-1.5 text-[12px] tracking-[0.08em] uppercase"
        >
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-10">
        {GROUPS.map((g) => {
          const rows = songs
            .map((s, i) => ({ s, i }))
            .filter(({ s }) => s.group === g.id);
          if (!rows.length) return null;

          return (
            <section key={g.id} className="mb-7">
              <div className="mb-2 flex items-center gap-2 text-gumba">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {ICONS[g.id]}
                </svg>
                <h3 className="ne text-[15px]">{g.ne}</h3>
                <span className="font-display text-[12px] text-tea/45 italic">{g.en}</span>
              </div>

              <ol>
                {rows.map(({ s, i }, r) => {
                  const now = i === index;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => onPick(i)}
                        className="flex w-full items-baseline gap-3 py-1.5 text-left"
                        style={{
                          // written by hand, so no two lines sit quite the same
                          transform: `rotate(${((r % 3) - 1) * 0.4}deg)`,
                          paddingLeft: `${(r % 4) * 3}px`,
                        }}
                        aria-current={now ? "true" : undefined}
                      >
                        <span className="hand w-6 shrink-0 text-[15px] text-tea/50">
                          {i + 1}.
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`hand block truncate text-[19px] leading-snug ${
                              now ? "text-gumba" : ""
                            }`}
                            style={
                              now
                                ? { boxShadow: "inset 0 -2px 0 var(--color-brass)" }
                                : undefined
                            }
                          >
                            {s.titleNe}
                          </span>
                          <span className="block truncate font-display text-[12px] text-tea/55 italic">
                            {s.title} · {s.artist}
                          </span>
                        </span>
                        {now && (
                          <span className="hand shrink-0 text-[12px] text-gumba">
                            बज्दै
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}

        <div className="mt-6 border-t border-tea/15 pt-4">
          <p className="ne text-[14px] text-tea/75">तपाईंको मनपर्ने गीत यहाँ छैन?</p>
          <a
            href={SONG_REQUEST_URL}
            target="_blank"
            rel="noreferrer"
            className="ne mt-1 inline-block text-[14px] text-gumba underline decoration-gumba/40 underline-offset-2"
          >
            गीत सुझाव दिनुहोस् · Suggest a song
          </a>
        </div>

        <p className="hand mt-4 text-[13px] text-tea/55">
          सबै गीत आ-आफ्ना धनीका हुन्। यो एउटा सानो श्रद्धाञ्जली मात्र हो।
          <span className="mt-1 block font-sans text-[11px] not-italic">
            All songs belong to their respective owners. A non-commercial tribute.
          </span>
        </p>
      </div>
    </aside>
  );
}
