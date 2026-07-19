import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "inverted" | "ghost";

const base =
  "inline-flex h-[42px] items-center justify-center rounded-lg px-5 text-sm font-medium " +
  "transition-transform outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-primary text-primary-foreground ring-1 ring-brand-primary hover:scale-[1.02] active:scale-100",
  secondary:
    "bg-surface-2 text-foreground ring-1 ring-foreground/5 hover:scale-[1.02] active:scale-100",
  inverted:
    "bg-background text-brand-primary ring-1 ring-background active:scale-95",
  ghost:
    "h-auto px-0 text-muted-foreground hover:text-foreground transition-colors",
};

export function Button({
  variant = "primary",
  asChild = false,
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
