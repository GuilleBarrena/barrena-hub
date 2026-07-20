import type { Organization } from "@/lib/organizations/types";

/**
 * The organization (company) chip shown directly under the Hub mark, the way
 * Stripe surfaces the active account beneath its logo.
 *
 * Adding or switching organizations is not available yet (`CAN_ADD_ORGANIZATION`
 * is off), so this renders as a static identity block rather than a menu —
 * no chevron, nothing to click. When `collapsed`, only the avatar remains.
 */
export function OrganizationSwitcher({
  organization,
  collapsed = false,
}: {
  organization: Organization;
  collapsed?: boolean;
}) {
  const initials = organization.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border border-border bg-surface px-2 py-2
                  ${collapsed ? "md:justify-center md:px-0" : ""}`}
      title={collapsed ? organization.name : undefined}
    >
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-md bg-brand-primary
                   text-[11px] font-semibold text-primary-foreground"
      >
        {initials}
      </span>
      <span className={`min-w-0 flex-col ${collapsed ? "flex md:hidden" : "flex"}`}>
        <span className="truncate text-sm font-medium text-foreground">
          {organization.name}
        </span>
        {organization.descriptor ? (
          <span className="truncate text-[11px] text-muted-foreground">
            {organization.descriptor}
          </span>
        ) : null}
      </span>
    </div>
  );
}
