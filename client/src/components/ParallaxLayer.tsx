import * as React from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { ScrollDirCtx } from './ScrollProvider'
type Props = { speed?: number, scale?: number, rotate?: number, className?: string, children?: React.ReactNode, invert?: boolean }
export default function ParallaxLayer({ speed=0.4, scale=0, rotate=0, className='', invert=false, children }: Props){
  const { ref, progress } = useScrollProgress<HTMLDivElement>({ rootMargin: '10% 0px -10% 0px' })
  const dir = React.useContext(ScrollDirCtx)
  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches : false
  const signed = (invert ? -1 : 1) * (dir === 'down' ? 1 : -1)
  const translateY = prefersReduced ? 0 : Math.round((0.5 - progress) * 100 * speed) * signed
  const s = prefersReduced ? 1 : (1 + (progress * (scale || 0)))
  const r = prefersReduced ? 0 : (progress * (rotate || 0))
  return <div ref={ref} aria-hidden className={className} style={{ transform:`translate3d(0, ${translateY}px, 0) scale(${s}) rotate(${r}deg)`, willChange:'transform' }}>{children}</div>
}
