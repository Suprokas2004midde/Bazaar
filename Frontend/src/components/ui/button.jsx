import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-accent)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary-accent)] text-[var(--bg-main)] hover:bg-[var(--primary-hover)] shadow-sm",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
        outline:
          "border border-[var(--border-color)] bg-transparent text-[var(--text-main)] hover:bg-[var(--secondary-accent)]/20",
        secondary:
          "bg-[var(--secondary-accent)] text-[var(--text-main)] hover:bg-[var(--secondary-accent)]/80",
        ghost:
          "text-[var(--text-main)] hover:bg-[var(--secondary-accent)]/15",
        link:
          "text-[var(--primary-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base font-semibold",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
