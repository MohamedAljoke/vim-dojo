export type Teach = { keys: string; meaning: string };

export type LevelSpec = {
  title: string;
  task: string;
  teaches: Teach[];
  /** "edit": make the buffer match `target`, then :wq. "reach": land the cursor on ◎. */
  kind: "edit" | "reach";
  /** The manifest. ‸ marks where the cursor starts, ◎ marks the reach target. */
  start: string;
  target?: string;
  solution: string;
  tip?: string;
};

export type ChapterSpec = {
  title: string;
  blurb: string;
  levels: LevelSpec[];
};

export type Level = LevelSpec & {
  id: string;
  chapter: number;
  chapterTitle: string;
  doc: string;
  cursor: number;
  targetPos: number | null;
  par: number;
};
