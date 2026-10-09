import { useSyncExternalStore } from "react";

export type LevelResult = { stars: number; best: number };
type Progress = Record<string, LevelResult>;

const KEY = "vim-dojo:progress";
const listeners = new Set<() => void>();
let cache: Progress | null = null;

function read(): Progress {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Progress;
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Progress) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private windows can refuse storage; progress then lasts for this tab only.
  }
  listeners.forEach((l) => l());
}

export function recordResult(id: string, keystrokes: number, stars: number) {
  const progress = read();
  const previous = progress[id];
  write({
    ...progress,
    [id]: {
      stars: Math.max(stars, previous?.stars ?? 0),
      best: Math.min(keystrokes, previous?.best ?? Infinity),
    },
  });
}

export function resetProgress() {
  write({});
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, read);
}
