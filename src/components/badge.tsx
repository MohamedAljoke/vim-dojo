import type { HTMLAttributes } from "react";

import { cx } from "../lib/cx";

export type BadgeTone = "teal" | "amber" | "rose" | "info" | "slate";

const tones: Record<BadgeTone, string> = {
  teal: "bg-success-wash text-success-ink",
  amber: "bg-warning-wash text-warning",
  rose: "bg-accent-wash text-accent",
  info: "bg-info-wash text-info",
  slate: "bg-surface-muted text-foreground-muted",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex min-h-6 items-center rounded-sm px-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
