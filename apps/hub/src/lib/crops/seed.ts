import { ringAreaHectares } from "./geo";
import type { Crop, LatLng } from "./types";

/**
 * SAMPLE crops, drawn over farmland near Olite (Navarra) purely so the map
 * opens somewhere plausible. They are not real registered plots.
 *
 * Display names stay Spanish - the UI is Spanish.
 */
export const FARM_CENTER: LatLng = [42.4795, -1.6512];
export const INITIAL_ZOOM = 15;

function sample(id: string, name: string, cropType: string, ring: LatLng[]): Crop {
  return {
    id,
    name,
    cropType,
    ring,
    areaHectares: ringAreaHectares(ring),
    createdAt: "2026-03-14T09:00:00.000Z",
    source: "sample",
  };
}

export const SAMPLE_CROPS: Crop[] = [
  sample("f-sample-01", "Parcela 01", "Viñedo", [
    [42.4832, -1.6584],
    [42.4834, -1.6521],
    [42.4805, -1.6518],
    [42.4802, -1.6581],
  ]),
  sample("f-sample-02", "Parcela 02", "Cereal", [
    [42.4799, -1.6583],
    [42.4801, -1.6522],
    [42.4771, -1.6519],
    [42.4769, -1.6579],
  ]),
  sample("f-sample-04", "Parcela 04", "Viñedo", [
    [42.4833, -1.6499],
    [42.4836, -1.6438],
    [42.4806, -1.6435],
    [42.4804, -1.6496],
  ]),
  sample("f-sample-07", "Parcela 07", "Olivar", [
    [42.4798, -1.6498],
    [42.48, -1.6441],
    [42.4772, -1.6438],
    [42.477, -1.6495],
  ]),
];
