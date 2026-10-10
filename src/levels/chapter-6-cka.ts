import type { ChapterSpec } from "./types";
import { yaml } from "./yaml";

export const cka: ChapterSpec = {
  title: "Exam moves",
  blurb: "Indentation, find-and-replace, and a timed-feeling boss fight.",
  levels: [
    {
      title: "Indent a line",
      kind: "edit",
      task: "“value” must sit under “name”. Indent it one level.",
      teaches: [{ keys: ">>", meaning: "indent the line one level (2 spaces here)" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
            env:
            - name: MODE
            ‸value: prod
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
            env:
            - name: MODE
              value: prod
      `,
      solution: ">>:wq<CR>",
      tip: "Exam .vimrc: set expandtab tabstop=2 shiftwidth=2 — so >> moves 2 spaces, never a tab.",
    },
    {
      title: "Outdent a line",
      kind: "edit",
      task: "“ports” is indented too far. Pull it back one level.",
      teaches: [{ keys: "<<", meaning: "outdent the line one level" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
              ‸ports:
            - containerPort: 80
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
      `,
      solution: "<<:wq<CR>",
    },
    {
      title: "Indent a block",
      kind: "edit",
      task: "Pasted YAML lost its indentation. Indent the last three lines one level.",
      teaches: [
        { keys: "V", meaning: "visual line mode — select whole lines, extend with the arrows" },
        { keys: ">", meaning: "indent the selection (< outdents)" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
          ‸image: nginx:1.27
          ports:
          - containerPort: 80
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
      `,
      solution: "V<Down><Down>>:wq<CR>",
      tip: "3>> does the same without visual mode. Pasting into vim on the exam? :set paste first, so it does not re-indent.",
    },
    {
      title: "Replace everywhere",
      kind: "edit",
      task: "k8s.gcr.io is frozen. Point every image at registry.k8s.io.",
      teaches: [{ keys: ":%s/old/new/g<CR>", meaning: "substitute in the whole file (% = every line, g = every match)" }],
      start: yaml`
        ‸apiVersion: v1
        kind: Pod
        metadata:
          name: legacy
        spec:
          initContainers:
          - name: init
            image: k8s.gcr.io/busybox:1.36
          containers:
          - name: app
            image: k8s.gcr.io/nginx:1.27
          - name: sidecar
            image: k8s.gcr.io/pause:3.9
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: legacy
        spec:
          initContainers:
          - name: init
            image: registry.k8s.io/busybox:1.36
          containers:
          - name: app
            image: registry.k8s.io/nginx:1.27
          - name: sidecar
            image: registry.k8s.io/pause:3.9
      `,
      solution: ":%s/k8s.gcr.io/registry.k8s.io/g<CR>:wq<CR>",
    },
    {
      title: "Boss: the full kubectl edit",
      kind: "edit",
      task: "Scale to 3 replicas, bump the image to nginx:1.27 and remove imagePullPolicy. Use search to get around.",
      teaches: [
        { keys: "/repl<CR>$r3", meaning: "find replicas, jump to the end, replace the digit" },
        { keys: "/image<CR>$ciw27<Esc>", meaning: "find the image, change the last number" },
        { keys: "/Pull<CR>dd", meaning: "find the policy line and delete it" },
      ],
      start: yaml`
        ‸apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: web
        spec:
          replicas: 1
          selector:
            matchLabels:
              app: web
          template:
            metadata:
              labels:
                app: web
            spec:
              containers:
              - name: web
                image: nginx:1.25
                imagePullPolicy: Always
                ports:
                - containerPort: 80
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
          template:
            metadata:
              labels:
                app: web
            spec:
              containers:
              - name: web
                image: nginx:1.27
                ports:
                - containerPort: 80
      `,
      solution: "/repl<CR>$r3/image<CR>$ciw27<Esc>/Pull<CR>dd:wq<CR>",
      tip: "That is the whole exam loop: search, jump, one small change, repeat, :wq.",
    },
  ],
};
