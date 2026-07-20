"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const boldWords = [
  'cost',
  'estimates',
  'precise',
  'takeoffs',
  'reliable',

];

export const TextGenerateEffect = ({
  words='',
  sub='',
  duration = 0.5,
  subColor = '#111827',
}: {
  words: string;
  sub?: string;
  duration?: number;
  subColor?: string;
}) => {
  let wordsArray = words.split(" ");
  let subArray = sub?.split(" ");

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
      <br />
      { subArray && (
        subArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (wordsArray.length + idx) * 0.15, duration }}
          style={{
            lineHeight: '1',
            fontSize: '1.2rem',
            fontWeight: boldWords.includes(word.toLowerCase()) ? 700 : 400,
            color: subColor,
          }}
        >
          {word}{" "}
        </motion.span>
      )))}
    </div>
  );
}
