# vim dojo — Manifest Mender

**Play: https://mohamedaljoke.github.io/vim-dojo/**

A small browser game for learning the vim you actually need for the **CKA**. Every level is a
Kubernetes manifest opened as if by `kubectl edit`: fix it, submit with `:wq`, and try to match
**par** — the number of keystrokes a fluent vim user would need.

No hjkl drills. Arrow keys work everywhere; they just cost keystrokes, so you'll *feel* why
`w`, `$`, `ciw` and `/search` exist.

## How it plays

- **Edit levels** — make the buffer match the target panel, then `:wq`. A wrong `:wq` is
  rejected ("manifest rejected") and you keep going. `:q` with unsaved changes gives you the real
  `E37` error. `:q!` throws the changes away and restarts the level.
- **Jump levels** — land the cursor on the highlighted ◎. Par is the jump; arrowing there works
  but scores 1 star.
- **Stars** — ≤ par ★★★, ≤ 1.5× par ★★, otherwise ★. After each level you see your keys next to
  a par solution.

## Curriculum

| Chapter | Moves |
|---|---|
| 1. Survive the editor | `:wq` `:q!` `Esc` `i` `a` `x` `u` `Ctrl-r` |
| 2. Jump, don't crawl | `w` `b` `W` `B` `5w` `$` `^` `0` `G` `gg` `:20` |
| 3. Change words | `cw` `ciw` `r` `dw` `daw` `D` `C` |
| 4. Whole lines | `dd` `3dd` `o` `O` `yy` `p` `I` `A` `cc` |
| 5. Find and search | `f` `t` `;` `ct-` `ci"` `di[` `/search` `n` `.` |
| 6. Exam moves | `>>` `<<` `V` + `>` `:%s/old/new/g` + a boss level |

The in-game cheatsheet also covers the `~/.vimrc` to set up in the first 30 seconds of the exam
(`set expandtab tabstop=2 shiftwidth=2 autoindent number`) and `:set paste`.

## Stack

- React + Vite + Tailwind v4 + TypeScript
- [CodeMirror 6](https://codemirror.net) with [`@replit/codemirror-vim`](https://github.com/replit/codemirror-vim)
  — a real vim emulation, so the muscle memory carries over to the exam terminal
- Visual language from the dyosmos design system (tokens, IBM Plex Sans + Barlow Semi Condensed,
  light/dark)
- Progress lives in `localStorage`; there is no backend

## Run it locally

```sh
npm install
npm run dev        # http://localhost:5173/vim-dojo/
npm run e2e        # builds, then replays every level's par solution in Chromium
```

## Add a level

Levels are data in `src/levels/chapter-*.ts`. Write the manifest with `‸` where the cursor
starts (and `◎` on the target for a jump level), the `target` manifest for an edit level, and a
`solution` in vim key notation — par is its length. The e2e suite fails if the solution doesn't
clear the level at 3 stars.
