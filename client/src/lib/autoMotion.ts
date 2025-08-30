type Cleanup = () => void
export function initAutoMotion(): Cleanup {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reduce.matches) return () => {}
  const revealObs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement
      if (e.isIntersecting) {
        if (el.getAttribute('data-anim') === 'off') continue
        const isHeading = /^H[1-4]$/.test(el.tagName)
        const anim = el.getAttribute('data-anim') || (isHeading ? 'slide' : 'fade')
        const base = anim === 'scale' ? 'anim-scale' : anim === 'fade' ? 'anim-fade' : 'anim-slide'
        el.classList.add('anim', base)
      } else {
        el.classList.remove('anim', 'anim-slide', 'anim-fade', 'anim-scale')
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
  document.querySelectorAll<HTMLElement>('section, .section, [data-anim], h1, h2, h3, h4')
    .forEach((el) => revealObs.observe(el))
  const stacks = Array.from(document.querySelectorAll<HTMLElement>('.card-stack'))
  const rAF = { id: 0 as number | 0 }
  const stackObs = new IntersectionObserver((entries) => {
    if (rAF.id) return
    rAF.id = requestAnimationFrame(() => {
      rAF.id = 0
      for (const e of entries) {
        const el = e.target as HTMLElement
        if (!e.isIntersecting) { el.style.removeProperty('--stack-progress'); continue }
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || document.documentElement.clientHeight
        const top = Math.min(vh, Math.max(0, rect.top))
        const bottom = Math.min(vh, Math.max(0, rect.bottom))
        const visible = Math.max(0, bottom - top)
        const progress = Math.max(0, Math.min(1, visible / Math.min(vh, rect.height || vh)))
        const dir = (document.documentElement.getAttribute('data-dir') === 'up') ? -0.08 : +0.08
        const p = Math.max(0, Math.min(1, progress + dir))
        el.style.setProperty('--stack-progress', String(p))
      }
    })
  }, { threshold: [0,0.1,0.25,0.5,0.75,1] })
  stacks.forEach((el) => stackObs.observe(el))
  const onReduceChange = () => {
    if (reduce.matches) {
      document.querySelectorAll('.anim, .anim-slide, .anim-fade, .anim-scale').forEach((n) => {
        (n as HTMLElement).classList.remove('anim', 'anim-slide', 'anim-fade', 'anim-scale')
      })
    }
  }
  reduce.addEventListener?.('change', onReduceChange)
  return () => {
    reduce.removeEventListener?.('change', onReduceChange)
    revealObs.disconnect()
    stackObs.disconnect()
    if (rAF.id) cancelAnimationFrame(rAF.id)
  }
}

try{
  const root = document.documentElement;
  const updateDir = () => root.style.setProperty('--dir', (window as any).__scrollDir === 'up' ? '-1' : '1');
  updateDir();
  window.addEventListener('scroll', updateDir, { passive: true });
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries){
      (e.target as HTMLElement).style.setProperty('--vis', String(e.intersectionRatio.toFixed(3)));
    }
  }, { threshold: [0, .25, .5, .75, 1] });
  document.querySelectorAll('[data-motion]').forEach(el=> io.observe(el));
}catch{}
