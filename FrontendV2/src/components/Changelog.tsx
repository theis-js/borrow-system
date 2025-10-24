import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "changelog";

type ChangeType =
  | "Hinzugefügt"
  | "Geändert"
  | "Behoben"
  | "Entfernt"
  | "Verbessert"
  | "Sicherheit"
  | "Veraltet"
  | string;

type ChangeEntry = {
  type: ChangeType;
  text: string | string[]; // aus localStorage kann es eine Liste sein
};

type ChangelogItem = {
  version?: string;
  date: string;
  changes: ChangeEntry[];
};

type StoredChangelog = {
  title: string;
  items: ChangelogItem[];
};

const typeStyles: Record<string, string> = {
  Hinzugefügt:
    "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  Geändert: "bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-500/30",
  Behoben: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  Entfernt: "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30",
  Verbessert:
    "bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30",
  Sicherheit: "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30",
  Veraltet: "bg-zinc-700/30 text-zinc-300 ring-1 ring-inset ring-zinc-600/40",
};

export default function Changelog() {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<StoredChangelog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  const loadFromStorage = () => {
    try {
      setError(null);
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      if (!raw) {
        setData(null);
        return;
      }
      const parsed = JSON.parse(raw) as StoredChangelog;
      if (!parsed || !Array.isArray(parsed.items)) {
        throw new Error("Ungültiges Format");
      }
      setData(parsed);
    } catch (e) {
      setError("Changelog konnte nicht aus localStorage geladen werden.");
      setData(null);
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadFromStorage();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!open) return null;

  const title = data?.title ?? "Changelog";
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.12),rgba(24,24,27,0))] flex items-center justify-center p-6">
      <div
        ref={cardRef}
        className={[
          "relative w-full max-w-6xl transition-all duration-300 ease-out",
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-1 scale-[0.99]",
        ].join(" ")}
        aria-live="polite"
      >
        {/* Gradient border wrapper */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-b from-zinc-700/60 via-zinc-700/20 to-zinc-800/60 shadow-2xl">
          {/* Card */}
          <div className="relative rounded-[calc(theme(borderRadius.2xl)-1px)] border border-zinc-800/70 bg-zinc-900/70 supports-[backdrop-filter]:bg-zinc-900/60 backdrop-blur-xl ring-1 ring-white/10">
            {/* Accent top line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {/* Close button */}
            <button
              aria-label="Changelog schließen"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Header */}
            <header className="px-10 pt-8 pb-6 border-b border-zinc-800/70">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-[30px] leading-8 font-semibold text-zinc-100 tracking-[-0.01em]">
                    {title}
                  </h1>
                  <p className="text-sm text-zinc-400">
                    Aktuelle Änderungen und Updates
                  </p>
                </div>
              </div>
            </header>

            {/* Body */}
            <div className="relative max-h-[78vh] overflow-y-auto">
              <div className="absolute pointer-events-none inset-x-0 top-0 h-8 bg-gradient-to-b from-zinc-900/70 to-transparent" />
              <div className="absolute pointer-events-none inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-900/80 to-transparent" />

              {error && (
                <div className="px-10 py-8">
                  <div className="rounded-lg border border-red-900/40 bg-red-900/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                </div>
              )}

              {!error && items.length === 0 && (
                <div className="px-10 py-16 text-center">
                  <p className="text-zinc-400">
                    Kein Changelog im localStorage gefunden (Key: {STORAGE_KEY}
                    ).
                  </p>
                </div>
              )}

              <ul className="divide-y divide-zinc-800/70">
                {items.map((entry, idx) => (
                  <li
                    key={`${entry.version ?? entry.date}-${idx}`}
                    className="px-10 py-8"
                  >
                    {/* Kopfzeile je Release */}
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      {entry.version && (
                        <span className="inline-flex items-center rounded-md bg-gradient-to-b from-zinc-100 to-zinc-300 text-zinc-900 px-3 py-0.5 text-sm font-semibold shadow-sm">
                          {entry.version}
                        </span>
                      )}
                      <time
                        className="text-sm text-zinc-400"
                        dateTime={entry.date}
                      >
                        {new Date(entry.date).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        })}
                      </time>
                    </div>

                    {/* Zweispaltiges Layout: Typ links, Text rechts (mit schöner Leselänge) */}
                    <dl
                      role="list"
                      className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-[max-content_1fr]"
                    >
                      {entry.changes.map((c, i) => (
                        <div key={i} className="contents">
                          <dt className="md:w-44 md:justify-end md:text-right">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                                typeStyles[c.type] ??
                                "bg-zinc-700/30 text-zinc-300 ring-1 ring-inset ring-zinc-600/40"
                              }`}
                            >
                              {c.type}
                            </span>
                          </dt>

                          <dd className="max-w-[74ch] text-[15px] leading-7 text-zinc-200 tracking-[0.005em]">
                            {Array.isArray(c.text) ? (
                              <ul className="ml-4 list-disc marker:text-zinc-500/70 space-y-1.5">
                                {c.text.map((t, k) => (
                                  <li key={k} className="break-words">
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="break-words">{c.text}</p>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
            </div>

            {/* soft bottom glow */}
            <div className="pointer-events-none absolute inset-x-12 -bottom-4 h-8 blur-2xl bg-indigo-600/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
