import type { ChapterSpec } from "./types";
import { yaml } from "./yaml";

export const survive: ChapterSpec = {
  title: "Survive the editor",
  blurb: "kubectl edit just opened vim. Get in, change a character, get out.",
  levels: [
    {
      title: "Save and quit",
      kind: "edit",
      task: "This Pod is already correct. Save it and leave the editor.",
      teaches: [
        { keys: ":wq<CR>", meaning: "write (save) and quit — how every edit level is submitted" },
        { keys: ":q!<CR>", meaning: "quit and throw the changes away — here it restarts the level" },
        { keys: "<Esc>", meaning: "back to NORMAL mode from anywhere. When lost, press it" },
      ],
      start: yaml`
        ‸apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      solution: ":wq<CR>",
      tip: "On the exam, :wq after kubectl edit applies the change. :q! cancels it.",
    },
    {
      title: "Append after the cursor",
      kind: "edit",
      task: "The image name is missing its last letter. Fix ngin → nginx.",
      teaches: [
        { keys: "a", meaning: "append — start typing just after the cursor" },
        { keys: "<Esc>", meaning: "leave INSERT mode" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: ngi‸n
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx
      `,
      solution: "ax<Esc>:wq<CR>",
    },
    {
      title: "Insert before the cursor",
      kind: "edit",
      task: "The tag lost its major version. Make it nginx:1.27.",
      teaches: [{ keys: "i", meaning: "insert — start typing just before the cursor" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:‸.27
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      solution: "i1<Esc>:wq<CR>",
    },
    {
      title: "Delete one character",
      kind: "edit",
      task: "Someone typed 30 replicas. The cluster wants 3.",
      teaches: [
        { keys: "x", meaning: "delete the character under the cursor" },
        { keys: "u", meaning: "undo the last change" },
        { keys: "<C-r>", meaning: "redo what you undid" },
      ],
      start: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: web
        spec:
          replicas: 3‸0
          selector:
            matchLabels:
              app: web
      `,
      target: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: web
        spec:
          replicas: 3
          selector:
            matchLabels:
              app: web
      `,
      solution: "x:wq<CR>",
      tip: "Made a mess? u undoes one change at a time — no need to restart.",
    },
  ],
};
