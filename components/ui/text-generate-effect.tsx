"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const boldWords = [
  'cost',
  'construction',
  'estimating,',
  'estimates',
  'precise',
  'takeoffs',
  'take',
  'care',
  'support',
  'competitive',
  'bids',
  'we',
];

export const TextGenerateEffect = ({
  words,
  sub,
  duration = 0.5,
}: {
  words: string;
  sub: string;
  duration?: number;
}) => {
  let wordsArray = words.split(" ");
  let subArray = sub.split(" ");

  return (
    <div className={cn("inline")}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.15, duration }}
        >
          {word}{" "}
        </motion.span>
      ))}
      {subArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (wordsArray.length + idx) * 0.15, duration }}
          style={{
            lineHeight: '1',
            fontSize: '1.25rem',
            fontWeight: boldWords.includes(word.toLowerCase()) ? 700 : 400,
            color: boldWords.includes(word.toLowerCase()) ? '#111827' : '#8a8c8f',
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </div>
  );
}
