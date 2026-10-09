const KEY_TOKEN = /<(?:Esc|CR|Up|Down|Left|Right|BS|C-[a-z])>|[\s\S]/g;

/** Splits vim key notation ("ciwfoo<Esc>:wq<CR>") into one entry per keystroke. */
export function tokenize(sequence: string): string[] {
  return sequence.match(KEY_TOKEN) ?? [];
}

const NAMED_KEYS: Record<string, string> = {
  Escape: "<Esc>",
  Enter: "<CR>",
  ArrowUp: "<Up>",
  ArrowDown: "<Down>",
  ArrowLeft: "<Left>",
  ArrowRight: "<Right>",
  Backspace: "<BS>",
  Tab: "<Tab>",
};

const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "Dead", "Unidentified"]);

/** The keystroke a keydown event represents in vim notation, or null for a bare modifier. */
export function keyFromEvent(event: KeyboardEvent): string | null {
  if (MODIFIER_KEYS.has(event.key)) return null;
  if (event.ctrlKey && event.key.length === 1) return `<C-${event.key.toLowerCase()}>`;
  return NAMED_KEYS[event.key] ?? (event.key.length === 1 ? event.key : `<${event.key}>`);
}
