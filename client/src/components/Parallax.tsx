import * as React from 'react'
export default function Parallax({ speed = 0.2, axis = 'y', clamp = [-200, 200], className, style, children }:
  { speed?: number; axis?: 'y'|'x'; clamp?: [number,number]; className?: string; style?: React.CSSProperties; children: React.ReactNode }){
  const ref = React.useRef<HTMLDivElement>(null)
  const raf = React.useRef<number | null>(null)
  const lastY = React.useRef<number>(typeof window !== 'undefined' ? (window.scrollY || 0) : 0)
  // AUTO_MOBILE_CLAMP
  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const el = ref.current; if (!el) return;
    el.style.willChange = 'transform, opacity';
    el.style.transform = 'translateZ(0)'
    const onScroll = () => {
      if (raf.current != null) return
      raf.current = requestAnimationFrame(() => {
        const scY = window.scrollY || 0
        const dir = document.documentElement.getAttribute('data-dir') === 'up' ? -1 : 1
        const delta = scY - lastY.current
        lastY.current = scY
        const pos = Math.max(clamp[0], Math.min(clamp[1], scY * speed * dir))
        const t = axis === 'y' ? `translate3d(0, ${pos}px, 0)` : `translate3d(${pos}px, 0, 0)`
        el.style.transform = t
        el.style.willChange = 'transform'
        if (Math.abs(delta) > 0.5) {
          const inertia = Math.max(clamp[0], Math.min(clamp[1], pos + delta * 0.12))
          const tt = axis === 'y' ? `translate3d(0, ${inertia}px, 0)` : `translate3d(${inertia}px, 0, 0)`
          el.style.transform = tt
        }
        raf.current = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current)
      window.removeEventListener('scroll', onScroll)
      el.style.transform = ''
      el.style.willChange = ''
    }
  }, [axis, speed, clamp])
  return <div ref={ref} className={className} style={style}>{children}</div>
}
