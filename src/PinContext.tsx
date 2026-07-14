'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface PinContextValue {
  isPinned: boolean;
  setPinned: (pinned: boolean) => void;
}

const PinContext = createContext<PinContextValue>({
  isPinned: false,
  setPinned: () => {},
});

export function PinProvider({ children }: { children: ReactNode }) {
  const [isPinned, setPinned] = useState(false);
  return (
    <PinContext.Provider value={{ isPinned, setPinned }}>
      {children}
    </PinContext.Provider>
  );
}

export function usePin() {
  return useContext(PinContext);
}
