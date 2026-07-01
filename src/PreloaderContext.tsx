import { createContext, useContext } from 'react'

interface PreloaderContextValue {
  preloaderDone: boolean
}

const PreloaderContext = createContext<PreloaderContextValue>({ preloaderDone: false })

export const PreloaderProvider = PreloaderContext.Provider
export function usePreloader() {
  return useContext(PreloaderContext)
}
