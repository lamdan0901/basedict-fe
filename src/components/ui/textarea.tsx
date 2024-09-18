import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "outlined";
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, ...props }, ref) => {
    return (
      <div>
        <textarea
          {...props}
          className={cn(
            "flex w-full bg-background text-sm  placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            (variant === "default" || !variant) &&
              "border min-h-[80px] border-input px-3 py-2 ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            variant === "outlined" &&
              "border-b focus-visible:border-black py-1 outline-none border-neutral-400",
            className
          )}
          ref={ref}
        />
        {error && <p className="text-xs pt-1 text-destructive">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
