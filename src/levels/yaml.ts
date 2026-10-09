/** Template tag that strips the shared indentation so manifests can be written inline. */
export function yaml(strings: TemplateStringsArray, ...values: unknown[]): string {
  const raw = String.raw({ raw: strings }, ...values).replace(/^\n/, "").replace(/\n\s*$/, "");
  const lines = raw.split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length));
  return lines.map((l) => l.slice(indent)).join("\n");
}
