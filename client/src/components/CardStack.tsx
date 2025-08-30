import React from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useScrollDirection, ScrollDir } from '../hooks/useScrollDirection'
export default function CardStack({ children, className='', gap=16, parallax=.06 }:
  { children: React.ReactNode, className?: string, gap?: number, parallax?: number }){
  const ref = React.useRef<HTMLDivElement|null>(null)
  const { progress } = useScrollProgress({ ref })
  const dir: ScrollDir = useScrollDirection()
  React.useEffect(()=>{
    const el = ref.current; if(!el) return
    el.style.setProperty('--stack-p', String(progress.toFixed(3)))
    el.style.setProperty('--stack-dir', dir === 'down' ? '1' : '-1')
    el.style.setProperty('--stack-gap', `${gap}px`)
    el.style.setProperty('--stack-parallax', String(parallax))
  }, [progress, dir, gap, parallax])
  return (
    <div ref={ref} className={`card-stack ${className}`} data-motion="stack">
      {React.Children.map(children, (child, i)=> (
        <div className="card" style={{ ['--i' as any]: i }}>{child}</div>
      ))}
    </div>
  )
}
