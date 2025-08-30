import * as React from 'react'

/**
 * ViewTransitions
 * Wraps children and triggers a view transition on `keyProp` changes.
 * Falls back gracefully if unsupported or Reduced Motion is enabled.
 */
export default function ViewTransitions({
  keyProp,
  children,
}: {
  keyProp: string
  children: React.ReactNode
}) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // @ts-ignore - not always typed
  const canVT = typeof document !== 'undefined' && typeof document.startViewTransition === 'function'
    ? // @ts-ignore
      (document.startViewTransition as (cb: () => void) => { finished: Promise<void> })
    : null

  const [currentKey, setCurrentKey] = React.useState(keyProp)

  React.useEffect(() => {
    if (keyProp === currentKey) return
    if (!canVT || reduce) { setCurrentKey(keyProp); return }
    canVT(() => { setCurrentKey(keyProp) })
  }, [keyProp, currentKey, canVT, reduce])

  return (
    <div id="page-root" style={{ viewTransitionName: 'page' } as React.CSSProperties}>
      <div key={currentKey}>{children}</div>
    </div>
  )
}
