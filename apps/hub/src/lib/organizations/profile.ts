/**
 * Editable organization profile.
 *
 * `data.ts` keeps the fixed identity the sidebar reads (`ACTIVE_ORGANIZATION`).
 * This adds the mutable, settings-page fields on top — location, timezone,
 * contact — seeded from that identity, so the org view has something real to
 * edit without disturbing the sidebar's static source.
 */

"use client";

import { createSettingsStore } from "@/lib/settings/store";
import { ACTIVE_ORGANIZATION } from "./data";

export interface OrganizationProfile {
  name: string;
  /** Sector / plan qualifier — the sidebar's `descriptor`. */
  descriptor: string;
  location: string;
  timezone: string;
  contactEmail: string;
}

export const DEFAULT_ORGANIZATION_PROFILE: OrganizationProfile = {
  name: ACTIVE_ORGANIZATION.name,
  descriptor: ACTIVE_ORGANIZATION.descriptor ?? "",
  location: "Olite, Navarra",
  timezone: "Europe/Madrid",
  contactEmail: "contacto@laatalaya.example",
};

const store = createSettingsStore<OrganizationProfile>(
  "hub:organization-profile",
  DEFAULT_ORGANIZATION_PROFILE,
);

export const useOrganizationProfile = store.useValue;
export const saveOrganizationProfile = store.save;
