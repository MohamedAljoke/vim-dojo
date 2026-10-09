import type { ChapterSpec } from "./types";
import { yaml } from "./yaml";

export const lines: ChapterSpec = {
  title: "Whole lines",
  blurb: "YAML is one key per line. Delete, copy, open and rewrite lines in one move.",
  levels: [
    {
      title: "Delete a line",
      kind: "edit",
      task: "Remove the imagePullPolicy line.",
      teaches: [{ keys: "dd", meaning: "delete the whole line, wherever the cursor is in it" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
            imagePull‸Policy: Always
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
      solution: "dd:wq<CR>",
    },
    {
      title: "Delete a block",
      kind: "edit",
      task: "Remove the whole resources block (3 lines).",
      teaches: [{ keys: "3dd", meaning: "delete 3 lines starting at the cursor" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
            ‸resources:
              limits:
                memory: 128Mi
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
      solution: "3dd:wq<CR>",
    },
    {
      title: "Open a line below",
      kind: "edit",
      task: "Also expose port 443, on a new line under port 80.",
      teaches: [{ keys: "o", meaning: "open a new line below and start typing — indentation is kept" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
            ports:
            - container‸Port: 80
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
            ports:
            - containerPort: 80
            - containerPort: 443
      `,
      solution: "o- containerPort: 443<Esc>:wq<CR>",
    },
    {
      title: "Open a line above",
      kind: "edit",
      task: "Put the Pod in the dev namespace: add “namespace: dev” on a new line above “name: web”.",
      teaches: [{ keys: "O", meaning: "open a new line above and start typing" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: w‸eb
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          namespace: dev
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      solution: "Onamespace: dev<Esc>:wq<CR>",
    },
    {
      title: "Copy and paste a line",
      kind: "edit",
      task: "Add a second label “tier: web” under “app: web”. Copy the line, then change the key.",
      teaches: [
        { keys: "yy", meaning: "yank (copy) the current line" },
        { keys: "p", meaning: "paste below the cursor line (P pastes above)" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
          labels:
            ‸app: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
          labels:
            app: web
            tier: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      solution: "yypciwtier<Esc>:wq<CR>",
      tip: "dd + p moves a line: dd cuts it, p puts it back one line lower.",
    },
    {
      title: "Insert at line start",
      kind: "edit",
      task: "Comment out the imagePullPolicy line (“# ” before the key).",
      teaches: [{ keys: "I", meaning: "insert at the first non-blank character of the line" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
            imagePullPolicy: Alw‸ays
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
            # imagePullPolicy: Always
      `,
      solution: "I# <Esc>:wq<CR>",
    },
    {
      title: "Append at line end",
      kind: "edit",
      task: "Pin the image: nginx → nginx:1.27.",
      teaches: [{ keys: "A", meaning: "append at the end of the line" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            ‸image: nginx
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
      solution: "A:1.27<Esc>:wq<CR>",
    },
    {
      title: "Rewrite a line",
      kind: "edit",
      task: "Replace the whole image line with “image: nginx:1.27”.",
      teaches: [{ keys: "cc", meaning: "change the whole line — indentation is kept" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:la‸test # TODO pin this
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
      solution: "ccimage: nginx:1.27<Esc>:wq<CR>",
    },
  ],
};
