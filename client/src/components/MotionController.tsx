import * as React from 'react'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { initAutoMotion } from '../lib/autoMotion'
export default function MotionController({ children }:{ children: React.ReactNode }) {
  useScrollDirection(2)
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => document.documentElement.setAttribute('data-prm', mq.matches ? 'reduce' : 'ok')
    set(); mq.addEventListener?.('change', set)
    return () => mq.removeEventListener?.('change', set)
  }, [])
  React.useEffect(() => {
    const cleanup = initAutoMotion()
    return () => cleanup()
  }, [])
  return <>{children}</>
}
