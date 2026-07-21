/**
 * The single handle shared between the station card list and the map on the
 * field view.
 *
 * `stations` is derived from the field's position alone (no settings). The
 * `activeId` is ephemeral UI state — which card the pointer is over right now —
 * and lives here precisely because two sibling components need it: the list
 * sets it on hover, the map reads it to pan. That's the whole reason it isn't
 * config: it changes many times a second and belongs to no store.
 */

"use client";

import { useMemo, useState } from "react";
import type { Field } from "@/lib/fields/types";
import { stationsNearField } from "./nearby";
import type { NearbyStation } from "./types";

export interface NearbyStationsState {
  stations: NearbyStation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export function useNearbyStations(field: Field | null): NearbyStationsState {
  // Nullable so the hook can be called before the field has loaded, keeping the
  // hook order stable across a component's loading/found states.
  const stations = useMemo(() => (field ? stationsNearField(field) : []), [field]);
  const [activeId, setActiveId] = useState<string | null>(null);
  return { stations, activeId, setActiveId };
}
