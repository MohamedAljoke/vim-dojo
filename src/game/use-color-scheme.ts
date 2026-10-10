import { useState } from "react";

type Scheme = "light" | "dark";

// With no saved choice the page follows the OS (styles.css), like the DSA guide.
const current = (): Scheme =>
  (document.documentElement.dataset.theme as Scheme | undefined) ??
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function useColorScheme() {
  const [scheme, setScheme] = useState<Scheme>(current);
  const toggle = () => {
    const next: Scheme = scheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("vim-dojo:scheme", next);
    } catch {
      // Not persisting the theme is harmless.
    }
    setScheme(next);
  };
  return { scheme, toggle };
}
