import { ArrowRight, Crosshair, FilePen } from "lucide-react";
import { Link } from "react-router-dom";

import { buttonClass } from "../components/button";
import { Stars } from "../components/stars";
import { useProgress } from "../game/use-progress";
import { chapters, levels } from "../levels";
import { cx } from "../lib/cx";

export function MapPage() {
  const progress = useProgress();
  const earned = levels.reduce((sum, l) => sum + (progress[l.id]?.stars ?? 0), 0);
  const nextUp = levels.find((l) => (progress[l.id]?.stars ?? 0) < 3) ?? levels[0];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="dy-kicker">Manifest Mender</p>
          <h1 className="dy-display mt-1 text-4xl text-foreground">Vim for the CKA, one manifest at a time</h1>
          <p className="mt-2 text-foreground-muted">
            Every level is a Kubernetes YAML opened with <code className="font-mono">kubectl edit</code>. Fix
            it, submit with <kbd className="kbd">:wq</kbd>, and try to match par — the keystrokes a fluent
            vim user would need. Arrow keys are fine; the jumps are just faster.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <p className="dy-tabular text-sm text-foreground-muted">
            <strong className="text-2xl text-foreground">{earned}</strong> / {levels.length * 3} stars
          </p>
          <Link className={buttonClass("primary", "lg")} to={`/level/${nextUp.id}`}>
            {earned === 0 ? "Start" : "Continue"} with {nextUp.id} <ArrowRight aria-hidden size={18} />
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {chapters.map((chapter) => (
          <section className="rounded-xl border border-border bg-surface p-5" key={chapter.number}>
            <p className="dy-label">Chapter {chapter.number}</p>
            <h2 className="dy-display text-2xl text-foreground">{chapter.title}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{chapter.blurb}</p>
            <ol className="mt-4 flex flex-col gap-1.5">
              {chapter.levels.map((level) => {
                const result = progress[level.id];
                return (
                  <li key={level.id}>
                    <Link
                      className={cx(
                        "flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2 transition hover:border-border-strong hover:bg-surface-muted",
                        level.id === nextUp.id ? "border-accent" : "border-border",
                      )}
                      to={`/level/${level.id}`}
                    >
                      <span className="dy-tabular w-8 font-mono text-xs text-foreground-subtle">{level.id}</span>
                      {level.kind === "edit" ? (
                        <FilePen aria-label="edit level" className="shrink-0 text-info" size={16} />
                      ) : (
                        <Crosshair aria-label="jump level" className="shrink-0 text-warning" size={16} />
                      )}
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">{level.title}</span>
                      <span className="hidden max-w-[40%] truncate font-mono text-xs text-foreground-subtle sm:inline">
                        {level.teaches.map((t) => t.keys.replace(/<CR>/g, "")).join(" ")}
                      </span>
                      <Stars count={result?.stars ?? 0} size={14} />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
