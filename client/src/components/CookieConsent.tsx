import React from 'react';

const KEY = 'ks_cookie_consent_v1';

export default function CookieConsent(){
  const [show, setShow] = React.useState(false);
  React.useEffect(()=>{
    // Only prompt if analytics is configured
    const domain = (import.meta as any).env?.VITE_PLAUSIBLE_DOMAIN;
    if (!domain) return;
    const seen = localStorage.getItem(KEY);
    if (!seen) setShow(true);
  },[]);
  if (!show) return null;
  return (
    <div role="dialog" aria-live="polite" className="fixed inset-x-2 bottom-2 z-[60] rounded-xl border border-white/10 bg-white/10 backdrop-blur p-3 text-sm">
      <p className="m-0">We use privacy‑friendly analytics to improve the site. No tracking cookies beyond essentials.</p>
      <div className="mt-2 flex gap-2 justify-end">
        <button className="border border-white/20 rounded px-3 py-1" onClick={()=>{ localStorage.setItem(KEY,'dismissed'); setShow(false); }}>Dismiss</button>
        <a className="border border-white/20 rounded px-3 py-1" href="/privacy.html">Privacy</a>
      </div>
    </div>
  );
}
