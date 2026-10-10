import { Keys } from "../components/keys";
import { chapters } from "../levels";

const examSetup = [
  { line: "set expandtab", why: "Tab inserts spaces — YAML rejects tab characters" },
  { line: "set tabstop=2 shiftwidth=2", why: "Tab and >> / << move exactly 2 spaces" },
  { line: "set autoindent", why: "o and O keep the indentation of the line you came from" },
  { line: "set number", why: "line numbers, so :20 matches the error kubectl printed" },
];

export function CheatsheetPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="dy-display text-4xl text-foreground">Cheatsheet</h1>
        <p className="mt-1 text-foreground-muted">Every move the levels teach, in the order they teach it.</p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="dy-display text-2xl text-foreground">Exam setup — first 30 seconds</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          kubectl edit opens <code className="font-mono">$KUBE_EDITOR</code>, then{" "}
          <code className="font-mono">$EDITOR</code>, then vi. Put these lines in{" "}
          <code className="font-mono">~/.vimrc</code> on the exam terminal before the first edit:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-code p-3 font-mono text-sm text-foreground">
          {examSetup.map((s) => s.line).join("\n")}
        </pre>
        <ul className="mt-3 grid gap-1 text-sm text-foreground-muted sm:grid-cols-2">
          {examSetup.map((s) => (
            <li key={s.line}>
              <code className="font-mono text-foreground">{s.line}</code> — {s.why}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-foreground-muted">
          Pasting YAML from the docs? Run <Keys sequence=":set paste<CR>" /> before entering INSERT mode so vim
          does not stack indentation, and <Keys sequence=":set nopaste<CR>" /> after.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {chapters.map((chapter) => {
          const seen = new Set<string>();
          const moves = chapter.levels
            .flatMap((l) => l.teaches)
            .filter((t) => !seen.has(t.keys) && seen.add(t.keys));
          return (
            <section className="rounded-xl border border-border bg-surface p-5" key={chapter.number}>
              <h2 className="dy-display text-xl text-foreground">
                {chapter.number}. {chapter.title}
              </h2>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {moves.map((m) => (
                    <tr className="border-t border-border first:border-t-0" key={m.keys}>
                      <td className="w-40 py-2 pr-3 align-top">
                        <Keys sequence={m.keys} />
                      </td>
                      <td className="py-2 text-foreground-muted">{m.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>
    </div>
  );
}
