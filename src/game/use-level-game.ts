import { useRef, useState } from "react";

import { normalize, starsFor } from "../levels";
import type { Level } from "../levels/types";
import { recordResult } from "./use-progress";
import type { EditorEvents, ExCommand } from "./vim-editor";

export type Feedback = { tone: "rose" | "info" | "amber"; text: string };
export type Result = { stars: number; keystrokes: number };

function differingLines(doc: string, target: string) {
  const a = normalize(doc).split("\n");
  const b = normalize(target).split("\n");
  let count = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) count++;
  return count;
}

export function useLevelGame(level: Level) {
  const [attempt, setAttempt] = useState(0);
  const [keys, setKeys] = useState<string[]>([]);
  const [mode, setMode] = useState("normal");
  const [doc, setDoc] = useState(level.doc);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [shake, setShake] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  // Refs, not state: vim fires key, mode and cursor events inside one keydown, before React renders.
  const keysRef = useRef<string[]>([]);
  const modeRef = useRef("normal");
  const docRef = useRef(level.doc);
  const doneRef = useRef(false);
  const savedDoc = useRef(level.doc);

  const restart = () => {
    setAttempt((a) => a + 1);
    setKeys([]);
    setMode("normal");
    setDoc(level.doc);
    setFeedback(null);
    setResult(null);
    keysRef.current = [];
    modeRef.current = "normal";
    docRef.current = level.doc;
    doneRef.current = false;
    savedDoc.current = level.doc;
  };

  const win = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    const keystrokes = keysRef.current.length;
    const stars = starsFor(keystrokes, level.par);
    recordResult(level.id, keystrokes, stars);
    setResult({ stars, keystrokes });
  };

  const reject = (text: string) => {
    setFeedback({ tone: "rose", text });
    setShake((s) => s + 1);
  };

  const submit = (text: string) => {
    if (level.kind === "reach") {
      reject("This is a jump level — nothing to save. Land the cursor on the ◎.");
      return;
    }
    const left = differingLines(text, level.target!);
    if (left === 0) win();
    else reject(`Manifest rejected — ${left} line${left === 1 ? "" : "s"} still differ${left === 1 ? "s" : ""} from the target. Keep editing, or :q! to start over.`);
  };

  const onEx = (command: ExCommand, bang: boolean) => {
    const current = docRef.current;
    if (command === "wq") return submit(current);
    if (command === "write") {
      savedDoc.current = current;
      setFeedback({
        tone: "info",
        text: "Written. On the exam :w alone keeps you in the editor — :q now, or use :wq next time.",
      });
      return;
    }
    if (bang) return restart();
    if (current !== savedDoc.current) {
      reject("E37: No write since last change (add ! to override). :wq saves, :q! discards.");
      return;
    }
    submit(current);
  };

  const events: EditorEvents = {
    onKey: (key) => {
      keysRef.current = [...keysRef.current, key];
      setKeys(keysRef.current);
    },
    onMode: (next) => {
      modeRef.current = next;
      setMode(next);
    },
    onDoc: (next) => {
      docRef.current = next;
      setDoc(next);
    },
    onEx,
    onCursor: (pos, target) => {
      if (level.kind !== "reach" || target === null) return;
      if (pos === target && modeRef.current === "normal") win();
    },
  };

  return { attempt, keys, mode, doc, feedback, shake, result, restart, events };
}
