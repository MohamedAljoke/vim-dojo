import { Star } from "lucide-react";

import { cx } from "../lib/cx";

export function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} of 3 stars`} role="img">
      {[1, 2, 3].map((n) => (
        <Star
          aria-hidden
          className={cx(n <= count ? "fill-warning text-warning" : "text-border-strong")}
          key={n}
          size={size}
        />
      ))}
    </span>
  );
}
