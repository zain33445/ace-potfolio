"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface BackgroundRippleEffectProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}

export const BackgroundRippleEffect = ({
  rows = 3,
  cols = 30,
  cellSize = 48,
  className,
}: BackgroundRippleEffectProps) => {
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [key, setKey] = useState(0);

  useEffect(() => {
    const triggerRipple = () => {
      setActiveCell({
        row: Math.floor(Math.random() * rows),
        col: Math.floor(Math.random() * cols),
      });

      setKey((prev) => prev + 1);
    };

    triggerRipple();

    const interval = setInterval(triggerRipple, 1800);

    return () => clearInterval(interval);
  }, [rows, cols]);

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden",
        className
      )}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: cols * cellSize,
          height: rows * cellSize,
        }}
      >
        <RippleGrid
          key={key}
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          activeCell={activeCell}
        />
      </div>
    </div>
  );
};

interface RippleGridProps {
  rows: number;
  cols: number;
  cellSize: number;
  activeCell: {
    row: number;
    col: number;
  } | null;
}

const RippleGrid = ({
  rows,
  cols,
  cellSize,
  activeCell,
}: RippleGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, i) => i),
    [rows, cols]
  );

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {cells.map((index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        const distance = activeCell
          ? Math.sqrt(
              Math.pow(row - activeCell.row, 2) +
                Math.pow(col - activeCell.col, 2)
            )
          : 0;

        return (
          <div
            key={index}
            className="ripple-cell"
            style={
              {
                "--delay": `${distance * 70}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}

      <style jsx>{`
        .ripple-cell {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          opacity: 0.35;
          animation: ripple 700ms ease-out var(--delay) both;
        }

        @keyframes ripple {
          0% {
            background: rgba(255,255,255,0.25);
            transform: scale(0.95);
          }

          40% {
            background: rgba(255,255,255,0.12);
            transform: scale(1);
          }

          100% {
            background: rgba(255,255,255,0.03);
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};