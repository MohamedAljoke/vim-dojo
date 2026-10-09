import type { HTMLAttributes } from "react";

import { cx } from "../lib/cx";

export type BadgeTone = "teal" | "amber" | "rose" | "info" | "slate";

const tones: Record<BadgeTone, string> = {
  teal: "border-success/30 bg-success/10 text-success",
  amber: "border-warning/30 bg-warning/10 text-warning",
  rose: "border-danger/30 bg-danger/10 text-danger",
  info: "border-info/30 bg-info/10 text-info",
  slate: "border-border bg-surface-muted text-foreground-muted",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex min-h-7 items-center rounded-sm border px-2.5 text-xs font-semibold uppercase tracking-normal",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
