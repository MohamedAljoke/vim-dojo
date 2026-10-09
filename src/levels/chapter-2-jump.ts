import type { ChapterSpec } from "./types";
import { yaml } from "./yaml";

export const jump: ChapterSpec = {
  title: "Jump, don't crawl",
  blurb: "Arrows work, but every arrow is a keystroke. Land on the ◎ with as few keys as you can.",
  levels: [
    {
      title: "Word by word",
      kind: "reach",
      task: "Put the cursor on the start of “backend”.",
      teaches: [{ keys: "w", meaning: "jump to the start of the next word" }],
      start: yaml`
        apiVersion: v1
        kind: Service
        metadata:
          name: web
          # ‸route traffic to the ◎backend pods
        spec:
          selector:
            app: backend
      `,
      solution: "wwww",
    },
    {
      title: "Count your jumps",
      kind: "reach",
      task: "Jump to “oncall” — it is five words away.",
      teaches: [{ keys: "5w", meaning: "a number before a motion repeats it: 5w = w w w w w" }],
      start: yaml`
        apiVersion: v1
        kind: ConfigMap
        metadata:
          name: alerts
          # ‸owned by the platform team ◎oncall rotation
        data:
          channel: "#platform"
      `,
      solution: "5w",
      tip: "Counts work with almost everything: 3x, 2dd, 4b…",
    },
    {
      title: "Back a few words",
      kind: "reach",
      task: "Jump back to the start of “down”.",
      teaches: [{ keys: "b", meaning: "jump back to the start of the previous word" }],
      start: yaml`
        apiVersion: autoscaling/v2
        kind: HorizontalPodAutoscaler
        metadata:
          name: web
          # scale ◎down after the ‸migration
        spec:
          minReplicas: 2
          maxReplicas: 10
      `,
      solution: "bbb",
      tip: "3b does the same in two keys.",
    },
    {
      title: "End of the line",
      kind: "reach",
      task: "Jump to the last character of the image line.",
      teaches: [{ keys: "$", meaning: "jump to the end of the line" }],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
        ‸    image: registry.k8s.io/nginx:1.27 # pinne◎d
      `,
      solution: "$",
    },
    {
      title: "Start of the text",
      kind: "reach",
      task: "Jump back to the “i” of image.",
      teaches: [
        { keys: "^", meaning: "jump to the first non-blank character of the line" },
        { keys: "0", meaning: "jump to column 0 — in YAML that is usually indentation" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            ◎image: registry.k8s.io/nginx:1.27 # pinne‸d
      `,
      solution: "^",
    },
    {
      title: "Big WORDs",
      kind: "reach",
      task: "Jump to the # comment. Small w stops at every dot, slash and colon — try W.",
      teaches: [
        { keys: "W", meaning: "jump to the next WORD — anything up to the next space" },
        { keys: "B", meaning: "jump back one WORD" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            ‸image: registry.k8s.io/nginx:1.27 ◎# pinned
      `,
      solution: "WW",
      tip: "Image references and URLs are full of punctuation. W/B treat them as one word.",
    },
    {
      title: "Bottom of the file",
      kind: "reach",
      task: "Jump to the last line of the manifest.",
      teaches: [
        { keys: "G", meaning: "jump to the last line" },
        { keys: "gg", meaning: "jump to the first line" },
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
                livenessProbe:
                  httpGet:
                    path: /healthz
                    ◎port: 80
      `,
      solution: "G",
    },
    {
      title: "Go to a line number",
      kind: "reach",
      task: "kubectl apply says the error is on line 20. Jump straight to it.",
      teaches: [{ keys: ":20<CR>", meaning: "jump to line 20 — error messages give you the number" }],
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
      solution: ":20<CR>",
      tip: "20G does the same thing.",
    },
  ],
};
