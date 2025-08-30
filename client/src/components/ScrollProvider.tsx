import * as React from 'react'
import { useScrollDirection, type ScrollDir } from '../hooks/useScrollDirection'
export const ScrollDirCtx = React.createContext<ScrollDir>('down')
export default function ScrollProvider({ children }:{ children: React.ReactNode }) {
  const dir = useScrollDirection(12)
  return <ScrollDirCtx.Provider value={dir}>{children}</ScrollDirCtx.Provider>
}
