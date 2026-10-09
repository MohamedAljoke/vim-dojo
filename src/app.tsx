import { Moon, Sun } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useColorScheme } from "./game/use-color-scheme";
import { cx } from "./lib/cx";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold transition",
    isActive ? "bg-surface-muted text-foreground" : "text-foreground-muted hover:text-foreground",
  );

export function App() {
  const { scheme, toggle } = useColorScheme();
  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <NavLink className="mr-4 flex items-center gap-2" to="/">
            <span className="grid size-8 place-items-center rounded-md bg-primary font-mono text-sm font-bold text-on-primary">
              :w
            </span>
            <span className="dy-display text-xl text-foreground">vim dojo</span>
          </NavLink>
          <nav aria-label="Main" className="flex items-center gap-1">
            <NavLink className={navClass} end to="/">
              Levels
            </NavLink>
            <NavLink className={navClass} to="/cheatsheet">
              Cheatsheet
            </NavLink>
          </nav>
          <button
            aria-label={scheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="ml-auto grid size-10 cursor-pointer place-items-center rounded-md border border-border bg-surface text-foreground-muted shadow-sm transition hover:bg-surface-muted hover:text-foreground"
            onClick={toggle}
            type="button"
          >
            {scheme === "dark" ? <Sun aria-hidden size={18} /> : <Moon aria-hidden size={18} />}
          </button>
        </div>
      </header>
      <p className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-center text-sm text-warning [@media(pointer:fine)]:hidden">
        This game needs a physical keyboard — vim has no touch controls.
      </p>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
