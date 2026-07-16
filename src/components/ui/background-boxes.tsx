import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BoxesCore = ({
  className,
  ...rest
}: {
  className?: string;
}) => {
  const rows = Array.from({ length: 35 });
  const cols = Array.from({ length: 50 });

  const colors = [
    "#334155",
    "#475569",
    "#64748b",
    "#1e40af",
    "#2563eb",
  ];

  return (
    <div
      className={cn(
        `
        absolute
        inset-0
        z-0
        flex
        pointer-events-none
        overflow-hidden
        -rotate-12
        scale-150
        `,
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={i}
          className="flex"
        >
          {cols.map((_, j) => {
            const color = colors[(i + j) % colors.length];

            return (
              <motion.div
                key={j}
                whileHover={{
                  backgroundColor: color,
                  transition: { duration: 0 },
                }}
                className="
                  relative
                  h-8
                  w-16
                  border
                  border-slate-700/40
                "
              >
                {j % 2 === 0 && i % 2 === 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="
                      pointer-events-none
                      absolute
                      -top-[14px]
                      -left-[22px]
                      h-6
                      w-10
                      stroke-[1px]
                      text-slate-700
                    "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                )}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);