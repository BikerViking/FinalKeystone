import * as React from 'react'
import { ScrollDirCtx } from './ScrollProvider'
export default function Revealer({ as: Tag = 'section', className = '', children, threshold = 0.15, stagger = 0, durationMs = 500, ...rest }:{ as?: any, className?: string, children?: React.ReactNode, threshold?: number, stagger?: number, durationMs?: number }) {
  const dir = React.useContext(ScrollDirCtx)
  const ref = React.useRef<HTMLElement | null>(null)
  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches : false
  React.useEffect(() => {
    const el = ref.current as HTMLElement | null
    if (!el) return
    if (prefersReduced) { el.style.opacity='1'; el.style.transform='none'; return }
    const initial = () => { el.style.opacity='0'; el.style.transform = `translateY(${dir === 'down' ? 24 : -24}px)` }
    const reveal = () => { el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22,1,0.36,1), opacity ${durationMs}ms cubic-bezier(0.22,1,0.36,1)`; el.style.opacity='1'; el.style.transform='translateY(0px)'; if(stagger>0){ const kids = Array.from(el.children) as HTMLElement[]; kids.forEach((k, i)=>{ k.style.transitionDelay = `${(i*stagger)/1000}s`; }) } }
    const reset = () => { el.style.transition='none'; el.style.opacity='0'; el.style.transform = `translateY(${dir === 'down' ? 24 : -24}px)`; if(stagger>0){ const kids = Array.from(el.children) as HTMLElement[]; kids.forEach(k=>{ k.style.transitionDelay = '0s' }) } }
    initial()
    const io = new IntersectionObserver((entries)=>{ entries.forEach(e => { if (e.isIntersecting) requestAnimationFrame(reveal); else requestAnimationFrame(reset) }) }, { threshold })
    io.observe(el)
    return () => { io.disconnect() }
  }, [dir, threshold, durationMs, prefersReduced])
  return React.createElement(Tag, { ref, className, ...rest }, children)
}
