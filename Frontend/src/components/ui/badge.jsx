import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--badge-bg)] text-[var(--badge-text)] shadow",
        secondary:
          "border-transparent bg-[var(--secondary-accent)]/20 text-[var(--text-main)]",
        destructive:
          "border-transparent bg-rose-500/20 text-rose-500 dark:text-rose-400",
        outline: "text-[var(--text-main)] border-[var(--border-color)]",
        accent: "border-transparent bg-[var(--primary-accent)] text-[var(--bg-main)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
