import { useState } from "react";

type Scheme = "light" | "dark";

export function useColorScheme() {
  const [scheme, setScheme] = useState<Scheme>(
    () => (document.documentElement.dataset.colorScheme as Scheme) ?? "dark",
  );
  const toggle = () => {
    const next: Scheme = scheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.colorScheme = next;
    try {
      localStorage.setItem("vim-dojo:scheme", next);
    } catch {
      // Not persisting the theme is harmless.
    }
    setScheme(next);
  };
  return { scheme, toggle };
}
