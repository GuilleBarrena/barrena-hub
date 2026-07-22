"use client";

import { useEffect, useId, useRef, useState } from "react";

import { geocode, type GeocodeResult } from "@/lib/map/geocode";

/**
 * Google-Maps-style place search over the map. Debounces input, geocodes with
 * Nominatim, and hands the chosen place back so the parent can fly the map
 * there. Purely a navigation aid: it never touches the polygon being drawn.
 */
export function LocationSearch({
  onSelect,
}: {
  onSelect: (result: GeocodeResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(-1);

  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Debounced geocoding, cancellable so stale responses never win. All state
  // updates happen inside the timer/promise callbacks (never synchronously in
  // the effect body); short queries are cleared from the onChange handler.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;

    const controller = new AbortController();
    let live = true;
    const timer = setTimeout(() => {
      setOpen(true);
      setLoading(true);
      setError(false);
      geocode(q, controller.signal)
        .then((r) => {
          if (!live) return;
          setResults(r);
          setActive(-1);
        })
        .catch((e) => {
          if (!live || (e instanceof DOMException && e.name === "AbortError")) return;
          setError(true);
          setResults([]);
        })
        .finally(() => {
          if (live) setLoading(false);
        });
    }, 350);

    return () => {
      live = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  // Close the dropdown when clicking away.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(r: GeocodeResult) {
    onSelect(r);
    setQuery(r.label);
    setOpen(false);
    setResults([]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active] ?? results[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="pointer-events-auto relative">
      <div className="flex items-center gap-2 rounded-full bg-background/95 px-3.5 py-2 shadow-sm ring-1 ring-black/10 backdrop-blur focus-within:ring-2 focus-within:ring-ring">
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            if (v.trim().length < 3) {
              setResults([]);
              setError(false);
            }
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Buscar un lugar o dirección"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            aria-label="Borrar búsqueda"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {open && (query.trim().length >= 3) && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-10 mt-1.5 max-h-64 overflow-y-auto rounded-2xl bg-background/98 py-1 shadow-lg ring-1 ring-black/10 backdrop-blur"
        >
          {loading && (
            <li className="px-3.5 py-2 text-[13px] text-muted-foreground">Buscando…</li>
          )}
          {!loading && error && (
            <li className="px-3.5 py-2 text-[13px] text-muted-foreground">
              No se pudo buscar. Revise la conexión.
            </li>
          )}
          {!loading && !error && results.length === 0 && (
            <li className="px-3.5 py-2 text-[13px] text-muted-foreground">
              Sin resultados.
            </li>
          )}
          {!loading &&
            results.map((r, i) => (
              <li key={`${r.center[0]},${r.center[1]},${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(r)}
                  className={`flex w-full items-start gap-2.5 px-3.5 py-2 text-left text-[13px] outline-none transition-colors ${
                    i === active ? "bg-surface-2 text-foreground" : "text-foreground hover:bg-surface-2/60"
                  }`}
                >
                  <PinIcon />
                  <span className="min-w-0 flex-1 leading-snug">{r.label}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
