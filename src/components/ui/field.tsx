import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full border-0 border-b border-stone-300 bg-transparent px-0 py-2 font-sans text-ink placeholder:text-stone-400 transition-colors duration-300 focus:border-ink focus:outline-none focus:ring-0",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none border-0 border-b border-stone-300 bg-transparent px-0 py-2 font-sans text-ink placeholder:text-stone-400 transition-colors duration-300 focus:border-ink focus:outline-none focus:ring-0",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1 block text-[0.7rem] uppercase tracking-widest text-ink-muted", className)}
      {...props}
    />
  );
}

/** Admin-area boxed input (slightly different affordance from the public form) */
export const BoxInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-none border border-stone-300 bg-white px-3 font-sans text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-ink focus:outline-none focus:ring-0",
      className
    )}
    {...props}
  />
));
BoxInput.displayName = "BoxInput";

export const BoxTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-none border border-stone-300 bg-white px-3 py-2 font-sans text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-ink focus:outline-none focus:ring-0",
      className
    )}
    {...props}
  />
));
BoxTextarea.displayName = "BoxTextarea";
