import type { PwsObservation, Units } from "@/lib/pws/types";
import { observationRows } from "@/lib/pws/format";

/**
 * The normalized readings of a single station, as a compact label/value grid.
 * Shared by the field-view overlay and the meteo page so a reading always
 * looks the same wherever it appears.
 */
export function StationObservation({
  observation,
  units,
  columns = 2,
}: {
  observation: PwsObservation;
  units: Units;
  columns?: 2 | 4;
}) {
  const rows = observationRows(observation, units);
  return (
    <div className={`grid gap-x-4 gap-y-3 ${columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {row.label}
          </span>
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
