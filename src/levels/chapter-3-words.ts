import type { ChapterSpec } from "./types";
import { yaml } from "./yaml";

export const words: ChapterSpec = {
  title: "Change words",
  blurb: "Operators + motions: c changes, d deletes. Most exam edits are one word.",
  levels: [
    {
      title: "Change a word",
      kind: "edit",
      task: "Rename the Service from frontend to backend.",
      teaches: [{ keys: "cw", meaning: "change from the cursor to the end of the word, then type" }],
      start: yaml`
        apiVersion: v1
        kind: Service
        metadata:
          name: ‸frontend
        spec:
          selector:
            app: backend
          ports:
          - port: 80
      `,
      target: yaml`
        apiVersion: v1
        kind: Service
        metadata:
          name: backend
        spec:
          selector:
            app: backend
          ports:
          - port: 80
      `,
      solution: "cwbackend<Esc>:wq<CR>",
    },
    {
      title: "Change inner word",
      kind: "edit",
      task: "The cursor is in the middle of “staging”. Move the Pod to production.",
      teaches: [{ keys: "ciw", meaning: "change the whole word under the cursor — from anywhere inside it" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
          namespace: sta‸ging
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
          namespace: production
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      solution: "ciwproduction<Esc>:wq<CR>",
      tip: "ciw is the move to remember. cw only changes from the cursor onward.",
    },
    {
      title: "Replace one character",
      kind: "edit",
      task: "Scale the Deployment to 5 replicas.",
      teaches: [{ keys: "r", meaning: "replace the character under the cursor — no INSERT mode, no Esc" }],
      start: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: web
        spec:
          replicas: ‸1
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
          replicas: 5
          selector:
            matchLabels:
              app: web
      `,
      solution: "r5:wq<CR>",
    },
    {
      title: "Delete a word",
      kind: "edit",
      task: "Remove the doubled “not” from the comment.",
      teaches: [
        { keys: "dw", meaning: "delete to the start of the next word" },
        { keys: "daw", meaning: "delete a word and its space, from anywhere inside it" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: debug
          # do not ‸not delete this pod
        spec:
          containers:
          - name: debug
            image: busybox:1.36
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: debug
          # do not delete this pod
        spec:
          containers:
          - name: debug
            image: busybox:1.36
      `,
      solution: "dw:wq<CR>",
    },
    {
      title: "Delete to end of line",
      kind: "edit",
      task: "Drop the trailing comment after the image.",
      teaches: [{ keys: "D", meaning: "delete from the cursor to the end of the line" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.25‸ # remove before prod
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.25
      `,
      solution: "D:wq<CR>",
    },
    {
      title: "Change to end of line",
      kind: "edit",
      task: "Swap the image for httpd:2.4.",
      teaches: [{ keys: "C", meaning: "change from the cursor to the end of the line" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: ‸nginx:1.25
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: httpd:2.4
      `,
      solution: "Chttpd:2.4<Esc>:wq<CR>",
    },
    {
      title: "Jump, then change",
      kind: "edit",
      task: "The container serves HTTPS now. Change the containerPort to 443.",
      teaches: [
        { keys: "$", meaning: "jump to the end of the line" },
        { keys: "ciw", meaning: "change the word under the cursor" },
      ],
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
            - ‸containerPort: 80
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
            - containerPort: 443
      `,
      solution: "$ciw443<Esc>:wq<CR>",
      tip: "Motion first, then operator: get there with $ w b f, then hit it with ciw.",
    },
  ],
};
