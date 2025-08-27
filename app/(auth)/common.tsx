import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("self-start text-[24px] font-bold", className)}>{children}</div>;
}

export function Button({
  children,
  className,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn(
        "text-md text-white text-[16px] font-semibold bg-[#DC1714] hover:bg-[#C51021] focus-visible:ring-2 focus-visible:ring-[#DC1714] focus-visible:ring-offset-2 rounded-[54px] py-2 w-full transition-all disabled:opacity-50",
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Error({ error, className }: { error: string[] | undefined; className?: string }) {
  return (
    error && (
      <ul className={cn("mb-4", className)}>
        {error.map((e, i) => (
          <li key={i} className="text-red-500 text-center">
            {e}
          </li>
        ))}
      </ul>
    )
  );
}
