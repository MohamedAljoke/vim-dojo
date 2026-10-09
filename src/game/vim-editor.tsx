import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { EditorSelection, EditorState, RangeSetBuilder, StateField } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { getCM, Vim, vim } from "@replit/codemirror-vim";
import { useEffect, useRef } from "react";

import { keyFromEvent } from "../levels/keys";

export type ExCommand = "write" | "wq" | "quit";

export type EditorEvents = {
  onKey: (key: string) => void;
  onMode: (mode: string) => void;
  onDoc: (doc: string) => void;
  /** Fires on every cursor move with the (edit-mapped) reach target, if the level has one. */
  onCursor: (pos: number, target: number | null) => void;
  onEx: (command: ExCommand, bang: boolean) => void;
};

/* Vim is a module-level singleton, so ex commands are registered once and routed to whichever
   editor ran them. */
const exHandlers = new WeakMap<object, EditorEvents["onEx"]>();
let exRegistered = false;

function registerExCommands() {
  if (exRegistered) return;
  exRegistered = true;
  const define = (name: string, prefix: string, command: ExCommand) =>
    Vim.defineEx(name, prefix, (cm, params) => {
      const bang = (params.argString ?? "").trim().startsWith("!");
      const handler = exHandlers.get(cm);
      // Defer: the handler may unmount this very editor (":q!" restarts the level).
      if (handler) setTimeout(() => handler(command, bang));
    });
  define("write", "w", "write");
  define("wq", "wq", "wq");
  define("xit", "x", "wq");
  define("quit", "q", "quit");

  // Real vim with `autoindent` gives both o and O the current line's indentation. The emulator
  // builds O as "newline after the previous line", which copies the wrong line's indent.
  Vim.defineAction("newLineAndEnterInsertMode", function (this: VimActions, cm, actionArgs, vimState) {
    vimState.insertMode = true;
    const { line } = cm.getCursor();
    const indent = /^\s*/.exec(cm.getLine(line))![0];
    if (actionArgs.after) {
      const end = { line, ch: cm.getLine(line).length };
      cm.replaceRange(`\n${indent}`, end);
      cm.setCursor({ line: line + 1, ch: indent.length });
    } else {
      cm.replaceRange(`${indent}\n`, { line, ch: 0 });
      cm.setCursor({ line, ch: indent.length });
    }
    this.enterInsertMode(cm, { repeat: actionArgs.repeat }, vimState);
  });
}

type VimActions = {
  enterInsertMode: (cm: unknown, args: { repeat?: number }, vimState: unknown) => void;
};

function reachTarget(pos: number | null) {
  return StateField.define<number | null>({
    create: () => pos,
    update: (value, tr) => (value === null ? null : tr.changes.mapPos(value)),
    provide: (field) =>
      EditorView.decorations.from(field, (value) =>
        value === null
          ? Decoration.none
          : Decoration.set([Decoration.mark({ class: "cm-reach-target" }).range(value, value + 1)]),
      ),
  });
}

const yamlKey = /^(\s*(?:-\s+)?)([^\s#:"'][^:#]*?):(?=\s|$)/;
const yamlComment = /(^|\s)(#.*)$/;
const keyMark = Decoration.mark({ class: "cm-yaml-key" });
const commentMark = Decoration.mark({ class: "cm-yaml-comment" });

function yamlDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos);
      const key = yamlKey.exec(line.text);
      if (key) {
        const start = line.from + key[1].length;
        builder.add(start, start + key[2].length, keyMark);
      }
      const comment = yamlComment.exec(line.text);
      if (comment) {
        const start = line.from + comment.index + comment[1].length;
        builder.add(start, line.to, commentMark);
      }
      pos = line.to + 1;
    }
  }
  return builder.finish();
}

const yamlHighlight = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = yamlDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) this.decorations = yamlDecorations(update.view);
    }
  },
  { decorations: (v) => v.decorations },
);

const theme = EditorView.theme({
  "&": {
    color: "var(--dy-color-foreground)",
    backgroundColor: "var(--dy-color-surface)",
    fontSize: "15px",
    height: "100%",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: "var(--dy-font-mono)", lineHeight: "1.65" },
  ".cm-content": { padding: "12px 0", caretColor: "var(--dy-color-primary)" },
  ".cm-gutters": {
    backgroundColor: "var(--dy-color-surface)",
    color: "var(--dy-color-foreground-subtle)",
    border: "none",
    borderRight: "1px solid var(--dy-color-border)",
  },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--dy-color-primary) 7%, transparent)" },
  ".cm-activeLineGutter": {
    backgroundColor: "color-mix(in srgb, var(--dy-color-primary) 12%, transparent)",
    color: "var(--dy-color-foreground)",
  },
  ".cm-cursor": { borderLeft: "2px solid var(--dy-color-primary)" },
  ".cm-fat-cursor": {
    background: "var(--dy-color-primary) !important",
    color: "var(--dy-color-on-primary) !important",
    outline: "none !important",
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    background: "none !important",
    outline: "1px solid var(--dy-color-primary) !important",
  },
  ".cm-selectionBackground, &.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--dy-color-info) 35%, transparent) !important",
  },
  ".cm-searchMatch": {
    backgroundColor: "color-mix(in srgb, var(--dy-color-warning) 30%, transparent)",
    outline: "1px solid color-mix(in srgb, var(--dy-color-warning) 60%, transparent)",
  },
  ".cm-yaml-key": { color: "var(--dy-color-primary)" },
  ".cm-yaml-comment": { color: "var(--dy-color-foreground-subtle)", fontStyle: "italic" },
  ".cm-reach-target": {
    outline: "2px dashed var(--dy-color-warning)",
    outlineOffset: "1px",
    borderRadius: "2px",
    backgroundColor: "color-mix(in srgb, var(--dy-color-warning) 25%, transparent)",
  },
  ".cm-panels": {
    backgroundColor: "var(--dy-color-surface-muted)",
    color: "var(--dy-color-foreground)",
    borderTop: "1px solid var(--dy-color-border) !important",
  },
  ".cm-vim-panel": { fontFamily: "var(--dy-font-mono)", padding: "4px 12px", minHeight: "1.9em" },
  ".cm-vim-panel input": { color: "var(--dy-color-foreground)", fontFamily: "var(--dy-font-mono)" },
});

/** Keys that insert-mode should treat like vim with `set expandtab sw=2`. */
const insertTabAsSpaces = keymap.of([
  {
    key: "Tab",
    run: (view) => {
      view.dispatch(view.state.replaceSelection("  "));
      return true;
    },
  },
]);

type VimEditorProps = EditorEvents & {
  doc: string;
  cursor: number;
  targetPos: number | null;
  locked: boolean;
};

export function VimEditor({ doc, cursor, targetPos, locked, ...events }: VimEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  useEffect(() => {
    registerExCommands();
    const target = reachTarget(targetPos);
    const view = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc,
        selection: EditorSelection.cursor(cursor),
        extensions: [
          vim({ status: true }),
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          drawSelection(),
          history(),
          indentUnit.of("  "),
          EditorState.tabSize.of(2),
          insertTabAsSpaces,
          keymap.of([...defaultKeymap, ...historyKeymap]),
          theme,
          yamlHighlight,
          target,
          EditorView.contentAttributes.of({ "aria-label": "Manifest editor (vim)" }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) eventsRef.current.onDoc(update.state.doc.toString());
            if (update.selectionSet) eventsRef.current.onCursor(update.state.selection.main.head, update.state.field(target));
          }),
        ],
      }),
    });

    const cm = getCM(view)!;
    exHandlers.set(cm, (command, bang) => eventsRef.current.onEx(command, bang));
    cm.on("vim-mode-change", (e: { mode: string; subMode?: string }) => {
      eventsRef.current.onMode(e.subMode ? `${e.mode} ${e.subMode}` : e.mode);
    });

    const countKey = (event: KeyboardEvent) => {
      if (lockedRef.current) return;
      const key = keyFromEvent(event);
      if (key) eventsRef.current.onKey(key);
    };
    view.dom.addEventListener("keydown", countKey, true);
    view.focus();

    return () => {
      view.dom.removeEventListener("keydown", countKey, true);
      view.destroy();
    };
    // The editor is rebuilt by remounting (React key), never by prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="h-full min-h-0" ref={host} />;
}
