import { useEffect, useRef, useState } from 'react'
export type ScrollDir = 'down'|'up'
export function useScrollDirection(threshold: number = 2) {
  const [dir, setDir] = useState<ScrollDir>('down')
  const lastY = useRef<number>(typeof window !== 'undefined' ? (window.scrollY || 0) : 0)
  const ticking = useRef(false)
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY || 0
        const delta = y - lastY.current
        if (Math.abs(delta) > threshold) {
          const d = delta > 0 ? 'down' : 'up'
          setDir(d as ScrollDir)
          document.documentElement.setAttribute('data-dir', d)
        }
        lastY.current = y
        ticking.current = false
      })
    }
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > threshold) {
        const d = e.deltaY > 0 ? 'down' : 'up'
        setDir(d as ScrollDir)
        document.documentElement.setAttribute('data-dir', d)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
    }
  }, [threshold])
  return dir
}
