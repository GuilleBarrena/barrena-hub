import type { Organization } from "./types";

/**
 * Organizations (companies) the Hub belongs to.
 *
 * The product ships with a single organization and, for now, no way to add
 * more — so this is a fixed list rather than a repository like the other
 * domains. When multi-organization support lands, swap this for a
 * `createLocalStorageRepository` (or an HTTP-backed one) and add the create
 * flow; the sidebar already reads through `ACTIVE_ORGANIZATION`, so nothing
 * downstream has to change.
 */
export const ORGANIZATIONS: Organization[] = [
  {
    id: "org-atalaya",
    name: "Agrícola La Atalaya",
    descriptor: "Explotación agrícola",
  },
];

/** The organization currently in context. Single-org for now. */
export const ACTIVE_ORGANIZATION = ORGANIZATIONS[0];

/** Whether the user may create additional organizations. Off for now. */
export const CAN_ADD_ORGANIZATION = false;
