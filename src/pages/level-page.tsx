import { ArrowLeft, ArrowRight, Crosshair, Eye, EyeOff, FilePen, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Badge, type BadgeTone } from "../components/badge";
import { Button, buttonClass } from "../components/button";
import { Keys } from "../components/keys";
import { Stars } from "../components/stars";
import { useLevelGame } from "../game/use-level-game";
import { useProgress } from "../game/use-progress";
import { VimEditor } from "../game/vim-editor";
import { levelById, neighbours, normalize } from "../levels";
import type { Level } from "../levels/types";
import { cx } from "../lib/cx";

export function LevelPage() {
  const { id = "" } = useParams();
  const level = levelById(id);
  if (!level) {
    return (
      <div className="py-16 text-center">
        <p className="text-foreground-muted">There is no level {id}.</p>
        <Link className={cx(buttonClass("outline"), "mt-4")} to="/">
          Back to the levels
        </Link>
      </div>
    );
  }
  return <LevelGame key={level.id} level={level} />;
}

const modeTone: Record<string, BadgeTone> = { normal: "teal", insert: "amber", replace: "rose" };

function editTitle(doc: string) {
  const kind = /^kind: (\S+)/m.exec(doc)?.[1]?.toLowerCase() ?? "resource";
  const name = /^ {2}name: (\S+)/m.exec(doc)?.[1] ?? "web";
  return `kubectl edit ${kind}/${name}`;
}

function LevelGame({ level }: { level: Level }) {
  const game = useLevelGame(level);
  const { prev, next } = neighbours(level.id);
  const best = useProgress()[level.id];
  const [showSolution, setShowSolution] = useState(false);
  const navigate = useNavigate();
  const editorFrame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game.shake === 0) return;
    const el = editorFrame.current;
    el?.classList.remove("dy-shake");
    void el?.offsetWidth;
    el?.classList.add("dy-shake");
  }, [game.shake]);

  const modeLabel = game.mode.toUpperCase();
  const overPar = game.keys.length > level.par;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-foreground-muted">
            <Link className="hover:text-foreground hover:underline" to="/">
              Levels
            </Link>{" "}
            / Chapter {level.chapter} · {level.chapterTitle}
          </p>
          <h1 className="dy-display mt-1 text-3xl text-foreground">
            <span className="text-foreground-subtle">{level.id}</span> {level.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            aria-label="Previous level"
            disabled={!prev}
            onClick={() => prev && navigate(`/level/${prev.id}`)}
            size="sm"
            variant="outline"
          >
            <ArrowLeft aria-hidden size={17} />
          </Button>
          <Button onClick={game.restart} size="sm" variant="outline">
            <RotateCcw aria-hidden size={17} /> Restart
          </Button>
          <Button
            aria-label="Next level"
            disabled={!next}
            onClick={() => next && navigate(`/level/${next.id}`)}
            size="sm"
            variant="outline"
          >
            <ArrowRight aria-hidden size={17} />
          </Button>
        </div>
      </header>

      <section className="flex items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-sm">
        {level.kind === "edit" ? (
          <FilePen aria-hidden className="mt-0.5 shrink-0 text-primary" size={20} />
        ) : (
          <Crosshair aria-hidden className="mt-0.5 shrink-0 text-warning" size={20} />
        )}
        <div>
          <p className="text-base font-medium text-foreground">{level.task}</p>
          <p className="mt-1 text-sm text-foreground-muted">
            {level.kind === "edit" ? (
              <>
                Make the manifest match the target, then submit with <Keys sequence=":wq<CR>" />
              </>
            ) : (
              <>The level ends the moment the cursor lands on the highlighted character.</>
            )}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge aria-live="polite" tone={modeTone[game.mode] ?? "info"}>
              -- {modeLabel} --
            </Badge>
            <span className="dy-tabular ml-auto text-sm text-foreground-muted">
              Keys{" "}
              <strong className={cx("text-base", overPar ? "text-warning" : "text-foreground")}>
                {game.keys.length}
              </strong>{" "}
              / par {level.par}
            </span>
            {best ? (
              <span className="flex items-center gap-1.5 text-sm text-foreground-muted">
                best {best.best} <Stars count={best.stars} size={14} />
              </span>
            ) : null}
          </div>

          <div
            className="overflow-hidden rounded-md border border-border bg-surface shadow-sm"
            ref={editorFrame}
          >
            <div className="flex items-center gap-2 border-b border-border bg-surface-muted px-3 py-2 font-mono text-xs text-foreground-muted">
              <span aria-hidden className="size-2.5 rounded-full bg-danger/70" />
              <span aria-hidden className="size-2.5 rounded-full bg-warning/70" />
              <span aria-hidden className="size-2.5 rounded-full bg-success/70" />
              <span className="ml-2 truncate">$ {editTitle(level.doc)}</span>
            </div>
            <div className="h-[440px]">
              <VimEditor
                cursor={level.cursor}
                doc={level.doc}
                key={game.attempt}
                locked={game.result !== null}
                targetPos={level.targetPos}
                {...game.events}
              />
            </div>
          </div>

          <div aria-live="polite" className="min-h-6">
            {game.feedback ? (
              <p
                className={cx(
                  "rounded-md border px-3 py-2 text-sm",
                  game.feedback.tone === "rose" && "border-danger/30 bg-danger/10 text-danger",
                  game.feedback.tone === "info" && "border-info/30 bg-info/10 text-info",
                  game.feedback.tone === "amber" && "border-warning/30 bg-warning/10 text-warning",
                )}
              >
                {game.feedback.text}
              </p>
            ) : (
              <p className="text-sm text-foreground-subtle">
                Stuck? <Keys sequence="u" /> undoes, <Keys sequence="<Esc>" /> gets you back to NORMAL,{" "}
                <Keys sequence=":q!<CR>" /> restarts.
              </p>
            )}
          </div>

          <div className="rounded-md border border-border bg-surface p-3">
            <p className="text-xs font-semibold uppercase text-foreground-subtle">Your keys</p>
            <div className="mt-2 min-h-7">
              {game.keys.length ? (
                <Keys sequence={game.keys.join("")} />
              ) : (
                <span className="text-sm text-foreground-subtle">Nothing typed yet.</span>
              )}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          {level.kind === "edit" ? <TargetPanel doc={game.doc} target={level.target!} /> : null}

          <section className="rounded-md border border-border bg-surface p-4">
            <h2 className="dy-display text-lg text-foreground">Moves for this level</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {level.teaches.map((t) => (
                <li className="flex flex-col gap-1" key={t.keys}>
                  <Keys sequence={t.keys} />
                  <span className="text-sm text-foreground-muted">{t.meaning}</span>
                </li>
              ))}
            </ul>
            {level.tip ? (
              <p className="mt-4 border-t border-border pt-3 text-sm text-foreground-muted">
                <strong className="text-foreground">Tip:</strong> {level.tip}
              </p>
            ) : null}
          </section>

          <section className="rounded-md border border-border bg-surface p-4">
            <Button onClick={() => setShowSolution((s) => !s)} size="sm" variant="ghost">
              {showSolution ? <EyeOff aria-hidden size={17} /> : <Eye aria-hidden size={17} />}
              {showSolution ? "Hide" : "Show"} a par solution
            </Button>
            {showSolution ? (
              <div className="mt-3">
                <Keys sequence={level.solution} />
              </div>
            ) : null}
          </section>
        </aside>
      </div>

      {game.result ? (
        <WinDialog
          keystrokes={game.result.keystrokes}
          level={level}
          next={next?.id ?? null}
          onRetry={game.restart}
          stars={game.result.stars}
          typed={game.keys.join("")}
        />
      ) : null}
    </div>
  );
}

function TargetPanel({ doc, target }: { doc: string; target: string }) {
  const current = normalize(doc).split("\n");
  const lines = normalize(target).split("\n");
  const extra = Math.max(0, current.length - lines.length);
  return (
    <section className="rounded-md border border-border bg-surface p-4">
      <h2 className="dy-display text-lg text-foreground">Target</h2>
      <p className="text-xs text-foreground-subtle">Highlighted lines don't match yet.</p>
      <pre className="mt-3 overflow-x-auto rounded-sm bg-surface-muted py-2 font-mono text-xs leading-6">
        {lines.map((line, i) => (
          <div
            className={cx(
              "px-3",
              current[i] === line ? "text-foreground-muted" : "bg-warning/15 text-foreground",
            )}
            key={i}
          >
            {line || " "}
          </div>
        ))}
      </pre>
      {extra > 0 ? (
        <p className="mt-2 text-xs text-warning">
          Your manifest has {extra} extra line{extra === 1 ? "" : "s"}.
        </p>
      ) : null}
    </section>
  );
}

type WinDialogProps = {
  level: Level;
  stars: number;
  keystrokes: number;
  typed: string;
  next: string | null;
  onRetry: () => void;
};

function WinDialog({ level, stars, keystrokes, typed, next, onRetry }: WinDialogProps) {
  const navigate = useNavigate();
  const verdict =
    stars === 3
      ? keystrokes < level.par
        ? "Under par. You beat the reference solution."
        : "Par. That is exam speed."
      : stars === 2
        ? "Close. There is a shorter way."
        : "Done — now try it with fewer keys.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/70 p-4 backdrop-blur-sm">
      <div
        aria-labelledby="win-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-md border border-border bg-surface-raised p-6 shadow-md"
        onKeyDown={(e) => {
          if (e.key === "r") onRetry();
        }}
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="dy-display text-2xl text-foreground" id="win-title">
            {level.kind === "edit" ? "Manifest applied" : "Landed"}
          </h2>
          <Stars count={stars} size={24} />
        </div>
        <p className="mt-1 text-foreground-muted">{verdict}</p>

        <dl className="mt-5 grid gap-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-foreground-subtle">
              You · {keystrokes} keys
            </dt>
            <dd className="mt-1.5">
              <Keys sequence={typed} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-foreground-subtle">Par · {level.par} keys</dt>
            <dd className="mt-1.5">
              <Keys sequence={level.solution} />
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button onClick={onRetry} variant="outline">
            <RotateCcw aria-hidden size={17} /> Retry <kbd className="kbd">r</kbd>
          </Button>
          {next ? (
            <Button autoFocus onClick={() => navigate(`/level/${next}`)}>
              Next level <ArrowRight aria-hidden size={17} />
            </Button>
          ) : (
            <Button autoFocus onClick={() => navigate("/")}>
              All levels done — back to the map
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
