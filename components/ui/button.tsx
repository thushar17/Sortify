import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 active:not-aria-[haspopup]:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-blue-500/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_18px_40px_rgba(79,70,229,0.26)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(79,70,229,0.32)] focus-visible:ring-blue-200",
        outline:
          "border-white/80 bg-white/76 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/75 hover:text-blue-700 focus-visible:ring-blue-100",
        secondary:
          "border-slate-200/80 bg-slate-100/80 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-slate-300 hover:bg-slate-200/80 focus-visible:ring-slate-200",
        ghost:
          "text-slate-600 hover:bg-white/65 hover:text-slate-900 focus-visible:ring-blue-100",
        destructive:
          "border-rose-200/80 bg-rose-50/90 text-rose-700 shadow-[0_12px_30px_rgba(244,63,94,0.1)] hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100/90 focus-visible:ring-rose-100",
        link: "rounded-none px-0 text-blue-700 underline-offset-4 hover:underline focus-visible:ring-0",
      },
      size: {
        default:
          "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-7 gap-1.5 rounded-xl px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-xl px-3 text-[0.82rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 px-5 text-sm",
        icon: "size-11",
        "icon-xs": "size-7 rounded-xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
