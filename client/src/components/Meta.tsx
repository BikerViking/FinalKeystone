import * as React from 'react'
/** Meta: per-page SEO setter (title + description + canonical + OG/Twitter). */
export default function Meta({ title, description, path }: { title: string, description?: string, path?: string }){
  React.useEffect(() => {
    if (title) document.title = title
    const set = (sel: string, attr: string, val: string) => {
      let tag = document.querySelector(sel) as HTMLMetaElement | HTMLLinkElement | null
      if (!tag) {
        if (sel.startsWith('meta[')) { tag = document.createElement('meta') as any; const m = sel.match(/meta\[(name|property)='([^']+)'\]/); if (m) (tag as any).setAttribute(m[1], m[2]); }
        else if (sel.startsWith('link[')) { tag = document.createElement('link') as any; const m = sel.match(/link\[(rel)='([^']+)'\]/); if (m) (tag as any).setAttribute(m[1], m[2]); }
        if (tag) document.head.appendChild(tag)
      }
      if (tag) (tag as any).setAttribute(attr, val)
    }
    if (description) set("meta[name='description']", 'content', description)
    const url = (window.location.origin + (path || window.location.pathname))
    set("link[rel='canonical']", 'href', url)
    set("meta[property='og:title']", 'content', title)
    if (description) set("meta[property='og:description']", 'content', description)
    set("meta[property='og:url']", 'content', url)
    set("meta[name='twitter:title']", 'content', title)
    if (description) set("meta[name='twitter:description']", 'content', description)
  }, [title, description, path])
  return null
}
