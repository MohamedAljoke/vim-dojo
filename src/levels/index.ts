import { survive } from "./chapter-1-survive";
import { jump } from "./chapter-2-jump";
import { words } from "./chapter-3-words";
import { lines } from "./chapter-4-lines";
import { find } from "./chapter-5-find";
import { cka } from "./chapter-6-cka";
import { tokenize } from "./keys";
import type { ChapterSpec, Level, LevelSpec } from "./types";

const CURSOR_MARK = "‸";
const TARGET_MARK = "◎";

export const chapterSpecs: ChapterSpec[] = [survive, jump, words, lines, find, cka];

function build(spec: LevelSpec, chapter: number, index: number, chapterTitle: string): Level {
  // Each mark's offset is measured with the other mark removed, whichever comes first.
  const cursor = spec.start.replace(TARGET_MARK, "").indexOf(CURSOR_MARK);
  const target = spec.start.replace(CURSOR_MARK, "").indexOf(TARGET_MARK);
  const targetPos = target < 0 ? null : target;
  const doc = spec.start.replace(CURSOR_MARK, "").replace(TARGET_MARK, "");

  const id = `${chapter}-${index + 1}`;
  if (cursor < 0) throw new Error(`Level ${id} has no ${CURSOR_MARK} cursor mark`);
  if (spec.kind === "reach" && targetPos === null) throw new Error(`Reach level ${id} has no ${TARGET_MARK}`);
  if (spec.kind === "edit" && targetPos !== null) throw new Error(`Edit level ${id} has a stray ${TARGET_MARK}`);

  return {
    ...spec,
    id,
    chapter,
    chapterTitle,
    doc,
    cursor,
    targetPos,
    target: spec.kind === "edit" ? (spec.target ?? doc) : undefined,
    par: tokenize(spec.solution).length,
  };
}

export const chapters = chapterSpecs.map((spec, c) => ({
  number: c + 1,
  title: spec.title,
  blurb: spec.blurb,
  levels: spec.levels.map((level, i) => build(level, c + 1, i, spec.title)),
}));

export const levels: Level[] = chapters.flatMap((c) => c.levels);

export const levelById = (id: string) => levels.find((l) => l.id === id);

export function neighbours(id: string) {
  const i = levels.findIndex((l) => l.id === id);
  return { prev: levels[i - 1] ?? null, next: levels[i + 1] ?? null };
}

/** Lines are compared with trailing whitespace ignored — vim users should not lose a level to a stray space. */
export function normalize(text: string) {
  return text
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trimEnd();
}

export function starsFor(keystrokes: number, par: number) {
  if (keystrokes <= par) return 3;
  if (keystrokes <= Math.ceil(par * 1.5)) return 2;
  return 1;
}
