import type { ButtonHTMLAttributes } from "react";

import { cx } from "../lib/cx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-[color-mix(in_oklab,var(--ink)_86%,var(--p1))]",
  secondary: "border border-border bg-surface-muted text-foreground hover:border-border-strong",
  outline: "border border-border bg-transparent text-foreground hover:border-border-strong hover:bg-surface",
  ghost: "bg-transparent text-foreground-muted hover:bg-surface-muted hover:text-foreground",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 rounded-[10px] px-5 text-base",
};

export const buttonClass = (variant: ButtonVariant = "primary", size: ButtonSize = "md") =>
  cx(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition active:translate-y-px outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
    "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground-subtle disabled:opacity-60 disabled:shadow-none",
    sizes[size],
    variants[variant],
  );

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className, size, type = "button", variant, ...props }: ButtonProps) {
  return <button className={cx(buttonClass(variant, size), className)} type={type} {...props} />;
}
