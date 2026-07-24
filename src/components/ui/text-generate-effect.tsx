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

const CHUNK_SIZE = 3; // Batch words into groups of 3 — reduces motion.span count by ~3x

/** Split text into chunks of CHUNK_SIZE words for batched animation */
function chunkWords(words: string): string[] {
  const arr = words.split(" ");
  const chunks: string[] = [];
  for (let i = 0; i < arr.length; i += CHUNK_SIZE) {
    chunks.push(arr.slice(i, i + CHUNK_SIZE).join(" "));
  }
  return chunks;
}

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
  const wordChunks = chunkWords(words);
  const subChunks = sub ? chunkWords(sub) : [];
  const totalChunks = wordChunks.length;

  return (
    <div className={cn("inline")}>
      {wordChunks.map((chunk, idx) => (
        <motion.span
          key={`w-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.2, duration }}
          style={{}}
        >
          {chunk}{" "}
        </motion.span>
      ))}
      <br />
      {subChunks.map((chunk, idx) => (
        <motion.span
          key={`s-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (totalChunks + idx) * 0.2, duration }}
          style={{
            lineHeight: '1',
            fontSize: '1.2rem',
            fontWeight: boldWords.some(w => chunk.toLowerCase().includes(w)) ? 700 : 400,
            color: subColor,
            textAlign: 'justify',
          }}
        >
          {chunk}{" "}
        </motion.span>
      ))}
    </div>
  );
}
