import type { ChapterSpec } from "./types";
import { yaml } from "./yaml";

export const adapt: ChapterSpec = {
  title: "Copy and adapt",
  blurb: "The real exam loop: generate YAML, strip the noise, copy a block, bend it to the question.",
  levels: [
    {
      title: "Drop the status",
      kind: "edit",
      task: "This came from kubectl get -o yaml. Delete the whole status section at the bottom.",
      teaches: [{ keys: "dG", meaning: "delete from this line to the end of the file" }],
      start: yaml`
        ‸apiVersion: v1
        kind: Pod
        metadata:
          name: web
          namespace: default
        spec:
          containers:
          - name: web
            image: nginx:1.27
        status:
          phase: Running
          podIP: 10.244.1.7
          qosClass: BestEffort
          startTime: "2026-10-10T09:12:44Z"
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
          namespace: default
        spec:
          containers:
          - name: web
            image: nginx:1.27
      `,
      solution: "/^status<CR>dG:wq<CR>",
      tip: "Copying a live object into a new file? Search for status, dG, and the noise is gone.",
    },
    {
      title: "Delete every match",
      kind: "edit",
      task: "The dry-run left two “creationTimestamp: null” lines. Delete both in one command.",
      teaches: [{ keys: ":g/pattern/d<CR>", meaning: "delete every line that matches the pattern" }],
      start: yaml`
        ‸apiVersion: apps/v1
        kind: Deployment
        metadata:
          creationTimestamp: null
          labels:
            app: web
          name: web
        spec:
          replicas: 1
          selector:
            matchLabels:
              app: web
          template:
            metadata:
              creationTimestamp: null
              labels:
                app: web
            spec:
              containers:
              - image: nginx:1.27
                name: nginx
      `,
      target: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          labels:
            app: web
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
              - image: nginx:1.27
                name: nginx
      `,
      solution: ":g/creationTimestamp/d<CR>:wq<CR>",
    },
    {
      title: "Duplicate a container",
      kind: "edit",
      task: "Add a sidecar: copy the container, paste it below, and turn the copy into logger / busybox:1.36.",
      teaches: [
        { keys: "2yy", meaning: "yank two lines, starting at the cursor" },
        { keys: "ciW", meaning: "change a whole WORD — nginx:1.27 in one go" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          ‸- name: web
            image: nginx:1.27
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
          - name: logger
            image: busybox:1.36
      `,
      solution: "2yyjp$ciwlogger<Esc>j$ciWbusybox:1.36<Esc>:wq<CR>",
      tip: "Multi-container and sidecar tasks are this exact move: copy the container you have, then change what differs.",
    },
    {
      title: "Copy a block visually",
      kind: "edit",
      task: "Add a second env var LOG_LEVEL=debug. Copy the MODE pair and change the copy.",
      teaches: [
        { keys: "Vjy", meaning: "select two lines and yank them" },
        { keys: "p", meaning: "paste the lines below the cursor line" },
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
            env:
            ‸- name: MODE
              value: prod
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
            - name: LOG_LEVEL
              value: debug
      `,
      solution: "Vjyjp$ciwLOG_LEVEL<Esc>j$ciwdebug<Esc>:wq<CR>",
      tip: "After a yank the cursor goes back to the top of the selection, so step down with j before p.",
    },
    {
      title: "Paste above",
      kind: "edit",
      task: "Add a livenessProbe at /livez above the readinessProbe. Copy the probe, paste it above, adapt it.",
      teaches: [
        { keys: "V3jy", meaning: "yank the four probe lines" },
        { keys: "P", meaning: "paste above the cursor line" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: api
        spec:
          containers:
          - name: api
            image: registry.local/api:2.1
            ‸readinessProbe:
              httpGet:
                path: /healthz
                port: 8080
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: api
        spec:
          containers:
          - name: api
            image: registry.local/api:2.1
            livenessProbe:
              httpGet:
                path: /livez
                port: 8080
            readinessProbe:
              httpGet:
                path: /healthz
                port: 8080
      `,
      solution: "V3jyPciwlivenessProbe<Esc>/heal<CR>ciwlivez<Esc>:wq<CR>",
    },
    {
      title: "Rename only the copy",
      kind: "edit",
      task: "The second container is a fresh copy. Rename web to api in its two lines only.",
      teaches: [
        { keys: "Vj:", meaning: "select lines, then : opens a command for just those lines (:'<,'>)" },
        { keys: "s/old/new<CR>", meaning: "substitute on each selected line" },
      ],
      start: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: registry.local/web:2.1
          ‸- name: web
            image: registry.local/web:2.1
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: registry.local/web:2.1
          - name: api
            image: registry.local/api:2.1
      `,
      solution: "Vj:s/web/api<CR>:wq<CR>",
      tip: ":%s would rename the original too. Select first, then substitute.",
    },
    {
      title: "Delete by line numbers",
      kind: "edit",
      task: "The affinity block on lines 9–12 came along with a copy and does not belong. Delete it by number.",
      teaches: [{ keys: ":9,12d<CR>", meaning: "delete lines 9 to 12 without moving there" }],
      start: yaml`
        ‸apiVersion: v1
        kind: Pod
        metadata:
          name: web
        spec:
          containers:
          - name: web
            image: nginx:1.27
          affinity:
            nodeAffinity:
              requiredDuringSchedulingIgnoredDuringExecution:
                nodeSelectorTerms: []
          restartPolicy: Always
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
          restartPolicy: Always
      `,
      solution: ":9,12d<CR>:wq<CR>",
      tip: "Works with any ex command: :9,12y yanks them, :9,12> indents them.",
    },
    {
      title: "Change, then repeat",
      kind: "edit",
      task: "This Deployment came from the docs. Change all three app: nginx labels to api, but keep image nginx.",
      teaches: [
        { keys: "*N", meaning: "search for the word under the cursor, then step back onto it" },
        { keys: "cgn", meaning: "change the match under the cursor (or the next one)" },
        { keys: ".", meaning: "do the same change on the next match" },
      ],
      start: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: api
          labels:
            app: ‸nginx
        spec:
          replicas: 2
          selector:
            matchLabels:
              app: nginx
          template:
            metadata:
              labels:
                app: nginx
            spec:
              containers:
              - name: api
                image: nginx:1.27
      `,
      target: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: api
          labels:
            app: api
        spec:
          replicas: 2
          selector:
            matchLabels:
              app: api
          template:
            metadata:
              labels:
                app: api
            spec:
              containers:
              - name: api
                image: nginx:1.27
      `,
      solution: "*Ncgnapi<Esc>..:wq<CR>",
      tip: "Want to keep a match? Press n to skip it, then . on the next one. Each change is your call, unlike :%s.",
    },
    {
      title: "Comment out a block",
      kind: "edit",
      task: "Disable the resources block for now. Put “# ” in front of all three lines.",
      teaches: [
        { keys: "<C-v>2j", meaning: "visual block: select a column across three lines" },
        { keys: "I# <Esc>", meaning: "insert the same text at the start of every selected line" },
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
            ‸resources:
              limits:
                cpu: 500m
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
            # resources:
            #   limits:
            #     cpu: 500m
      `,
      solution: "<C-v>2jI# <Esc>:wq<CR>",
      tip: "To uncomment: <C-v>2jl selects the “# ” column, then d.",
    },
    {
      title: "Re-indent a pasted block",
      kind: "edit",
      task: "The pasted volumeMounts block landed two levels too far left. Indent it under the container.",
      teaches: [
        { keys: "V2j>", meaning: "select three lines and indent them one level" },
        { keys: ".", meaning: "repeat the indent on the same lines" },
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
        ‸volumeMounts:
        - name: data
          mountPath: /data
          volumes:
          - name: data
            emptyDir: {}
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
            volumeMounts:
            - name: data
              mountPath: /data
          volumes:
          - name: data
            emptyDir: {}
      `,
      solution: "V2j>.:wq<CR>",
      tip: "2> with the lines still selected also does two levels at once.",
    },
    {
      title: "Bump a number",
      kind: "edit",
      task: "Scale replicas from 1 to 3 and move the port from 8080 to 8081, without retyping either number.",
      teaches: [
        { keys: "<C-a>", meaning: "add 1 to the next number on the line (<C-x> subtracts)" },
        { keys: "2<C-a>", meaning: "add 2" },
      ],
      start: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: api
        spec:
          ‸replicas: 1
          selector:
            matchLabels:
              app: api
          template:
            metadata:
              labels:
                app: api
            spec:
              containers:
              - name: api
                image: registry.local/api:2.1
                ports:
                - containerPort: 8080
      `,
      target: yaml`
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: api
        spec:
          replicas: 3
          selector:
            matchLabels:
              app: api
          template:
            metadata:
              labels:
                app: api
            spec:
              containers:
              - name: api
                image: registry.local/api:2.1
                ports:
                - containerPort: 8081
      `,
      solution: "2<C-a>/8080<CR><C-a>:wq<CR>",
      tip: "<C-a> finds the number for you; the cursor only has to be on the line.",
    },
    {
      title: "Boss: dry-run to sidecar pod",
      kind: "edit",
      task: "Clean the dry-run output (creationTimestamp, resources: {}, status: {}), then add a logger container running busybox:1.36.",
      teaches: [
        { keys: ":g/{}/d<CR>", meaning: "delete every empty-object line" },
        { keys: "/- im<CR>2yyjp", meaning: "find the container, copy it below itself" },
        { keys: "$ciW", meaning: "replace the whole image reference" },
      ],
      start: yaml`
        ‸apiVersion: v1
        kind: Pod
        metadata:
          creationTimestamp: null
          labels:
            run: web
          name: web
        spec:
          containers:
          - image: nginx:1.27
            name: web
            resources: {}
          dnsPolicy: ClusterFirst
          restartPolicy: Always
        status: {}
      `,
      target: yaml`
        apiVersion: v1
        kind: Pod
        metadata:
          labels:
            run: web
          name: web
        spec:
          containers:
          - image: nginx:1.27
            name: web
          - image: busybox:1.36
            name: logger
          dnsPolicy: ClusterFirst
          restartPolicy: Always
      `,
      solution: ":g/{}/d<CR>:g/null/d<CR>/- im<CR>2yyjp$ciWbusybox:1.36<Esc>j$ciwlogger<Esc>:wq<CR>",
      tip: "kubectl run web --image=nginx:1.27 --dry-run=client -o yaml > pod.yaml, then exactly this.",
    },
  ],
};
