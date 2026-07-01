export function splitTextIntoChars(text: string): string[] {
  return text.split('').map((char) => (char === ' ' ? '\u00A0' : char));
}

export function splitTextIntoWords(text: string): string[] {
  return text.split(' ');
}

export const easeSoft = [0.22, 1, 0.36, 1] as const;

export const staggerConfig = {
  word: {
    each: 0.04,
    ease: easeSoft,
  },
  char: {
    each: 0.02,
    ease: easeSoft,
  },
};

export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.9,
      ease: easeSoft,
    },
  }),
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeSoft },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeSoft },
  },
};
