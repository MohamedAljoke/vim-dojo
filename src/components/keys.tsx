import { tokenize } from "../levels/keys";

export function Keys({ sequence }: { sequence: string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {tokenize(sequence).map((key, i) => (
        <kbd className="kbd" key={i}>
          {key === " " ? "␣" : key}
        </kbd>
      ))}
    </span>
  );
}
