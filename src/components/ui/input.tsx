import * as React from "react";

import { cn } from "@/shared/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outlined";
  containerClassName?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, variant, error, ...props }, ref) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        <input
          type={type}
          className={cn(
            "flex w-full bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  text-sm  disabled:cursor-not-allowed disabled:opacity-50",
            (variant === "default" || !variant) &&
              "h-10 rounded-md border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  px-3 py-2 focus-visible:ring-offset-2",
            variant === "outlined" &&
              "border-b focus-visible:border-black py-1 outline-none border-neutral-400",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs pt-1 text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
