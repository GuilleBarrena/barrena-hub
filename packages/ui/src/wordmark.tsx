/**
 * The Barrena Robotics logo lockup: the brand square + wordmark, optionally
 * prefixed with a product name ("Hub · Barrena Robotics").
 *
 *   <Wordmark />                              landing nav
 *   <Wordmark variant="footer" />            landing footer
 *   <Wordmark product="Hub" />               hub nav
 *   <Wordmark product="Hub" variant="footer" />  hub footer
 *
 * `nav` is the emphasised size; `footer` is smaller with a tinted square.
 */
export function Wordmark({
  product,
  variant = "nav",
  className = "",
}: {
  product?: string;
  variant?: "nav" | "footer";
  className?: string;
}) {
  const nav = variant === "nav";
  const square = nav ? "size-6 bg-brand-primary" : "size-5 bg-brand-primary/20";
  const text = nav ? "text-sm" : "text-xs";

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span aria-hidden className={`self-center rounded-[4px] ${square}`} />
      {product && (
        <>
          <span
            className={`${text} font-semibold uppercase tracking-tight text-foreground`}
          >
            {product}
          </span>
          <span className="text-[11px] text-muted-foreground">·</span>
        </>
      )}
      <span className={`${text} font-semibold tracking-tight text-foreground`}>
        Barrena Robotics
      </span>
    </span>
  );
}
