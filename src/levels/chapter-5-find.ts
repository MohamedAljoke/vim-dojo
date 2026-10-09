import type { ChapterSpec } from "./types";
import { yaml } from "./yaml";

export const find: ChapterSpec = {
  title: "Find and search",
  blurb: "Jump straight to a character or a word instead of counting your way there.",
  levels: [
    {
      title: "Find a character",
      kind: "reach",
      task: "Land on the colon before the tag 3.9.",
      teaches: [
        { keys: "f:", meaning: "find — jump onto the next “:” on this line" },
        { keys: ";", meaning: "repeat the last f/t forward (, goes backward)" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: sandbox
        spec:
          containers:
          - name: pause
            ‸image: registry.k8s.io/pause◎:3.9
      `,
      solution: "f:;",
    },
    {
      title: "Change till a character",
      kind: "edit",
      task: "Bump nginx:1.25-alpine to nginx:1.27-alpine without retyping “-alpine”.",
      teaches: [
        { keys: "ct-", meaning: "change till — up to, not including, the next “-”" },
        { keys: "t", meaning: "like f, but stops one character before the match" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:‸1.25-alpine
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27-alpine
      `,
      solution: "ct-1.27<Esc>:wq<CR>",
    },
    {
      title: "Change inside quotes",
      kind: "edit",
      task: "Make the container sleep instead: replace echo hello with sleep 3600.",
      teaches: [{ keys: 'ci"', meaning: "change everything inside the surrounding quotes" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: busybox
        spec:
          containers:
          - name: busybox
            image: busybox:1.36
            command: ["sh", "-c", "echo hel‸lo"]
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: busybox
        spec:
          containers:
          - name: busybox
            image: busybox:1.36
            command: ["sh", "-c", "sleep 3600"]
      `,
      solution: 'ci"sleep 3600<Esc>:wq<CR>',
    },
    {
      title: "Empty the brackets",
      kind: "edit",
      task: "Clear every argument: args should become [].",
      teaches: [
        { keys: "di[", meaning: "delete everything inside the surrounding [ ]" },
        { keys: "ci(", meaning: "the same idea works for ( ), { } and quotes" },
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
            args: ["--‸verbose", "--debug"]
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
            args: []
      `,
      solution: "di[:wq<CR>",
    },
    {
      title: "Search",
      kind: "reach",
      task: "Jump to livenessProbe by searching for it.",
      teaches: [
        { keys: "/live<CR>", meaning: "search forward — a few letters are enough" },
        { keys: "n", meaning: "next match (N goes back)" },
      ],
      start: yaml`
        ‸apiVersion: apps/v1
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
                ◎livenessProbe:
                  httpGet:
                    path: /healthz
                    port: 80
      `,
      solution: "/live<CR>",
    },
    {
      title: "Search, change, repeat",
      kind: "edit",
      task: "Promote the config: change every “staging” to “prod”.",
      teaches: [
        { keys: "/staging<CR>", meaning: "find the first one" },
        { keys: "ciwprod<Esc>", meaning: "change it" },
        { keys: "n.", meaning: "next match, then . repeats the last change" },
      ],
      start: yaml`
        ‸apiVersion: v1
        kind: ConfigMap
        metadata:
          name: app-config
          namespace: staging
        data:
          DB_HOST: db.staging.svc
          CACHE_HOST: cache.staging.svc
      `,
      target: yaml`
        apiVersion: v1
        kind: ConfigMap
        metadata:
          name: app-config
          namespace: prod
        data:
          DB_HOST: db.prod.svc
          CACHE_HOST: cache.prod.svc
      `,
      solution: "/staging<CR>ciwprod<Esc>n.n.:wq<CR>",
      tip: "The dot command is vim's superpower: make one change, then . anywhere repeats it.",
    },
  ],
};
