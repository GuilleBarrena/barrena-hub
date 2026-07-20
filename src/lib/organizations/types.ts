export interface Organization {
  id: string;
  /** Company name shown under the Hub mark in the sidebar. */
  name: string;
  /** Short qualifier under the name (sector, plan…). Optional. */
  descriptor?: string;
}
