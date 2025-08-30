import * as React from 'react'

export function useScrollProgress<T extends HTMLElement>(opts?: { ref?: React.RefObject<T>, rootMargin?: string }) {
  const internalRef = React.useRef<T | null>(null)
  const ref = opts?.ref || internalRef
  const [active, setActive] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const tickingRef = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setProgress(0); return }

    const io = new IntersectionObserver(
      entries => { for (const e of entries) setActive(e.isIntersecting) },
      { root: null, rootMargin: opts?.rootMargin ?? '0px', threshold: [0, 1] }
    )
    io.observe(el)

    const onScroll = () => {
      if (!active || tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const center = rect.top + rect.height / 2
        const p = 1 - (center / vh)
        setProgress(Math.max(0, Math.min(1, p)))
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, opts?.rootMargin])

  return { ref, progress } as const
}
