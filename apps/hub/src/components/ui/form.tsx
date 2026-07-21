import type { ComponentProps, ReactNode } from "react";

const CONTROL =
  "h-10 rounded-lg bg-surface px-3 text-sm text-foreground outline-none " +
  "ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring";

const LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground";

function Wrapper({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextField({
  id,
  label,
  hint,
  ...props
}: ComponentProps<"input"> & { id: string; label: string; hint?: ReactNode }) {
  return (
    <Wrapper id={id} label={label} hint={hint}>
      <input id={id} className={CONTROL} {...props} />
    </Wrapper>
  );
}

export function SelectField({
  id,
  label,
  hint,
  options,
  ...props
}: Omit<ComponentProps<"select">, "children"> & {
  id: string;
  label: string;
  hint?: ReactNode;
  /** Plain strings, or [value, label] when the stored value differs. */
  options: readonly (string | [string, string])[];
}) {
  return (
    <Wrapper id={id} label={label} hint={hint}>
      <select id={id} className={CONTROL} {...props}>
        {options.map((opt) => {
          const [value, text] = Array.isArray(opt) ? opt : [opt, opt];
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </Wrapper>
  );
}
