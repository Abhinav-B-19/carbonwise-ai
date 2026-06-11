import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        `
        bg-white
        border
        border-neutral-200
        rounded-3xl
        shadow-sm
        hover:shadow-md
        hover:-translate-y-1
        transition-all
        duration-300
        `,
        className
      )}
    >
      {children}
    </div>
  );
}