/** Minimal client logger — sends errors to /api/log when Sentry isn't configured. */
export function installClientLogger(){
  if ((window as any).__loggerInstalled) return;
  (window as any).__loggerInstalled = true;
  const send = (payload: any)=> {
    try{
      fetch('/api/log', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    }catch(_e){/* ignore */}
  };
  window.addEventListener('error', (e)=> send({ type:'error', message: e.message, source: e.filename, lineno: e.lineno, colno: e.colno }));
  window.addEventListener('unhandledrejection', (e)=> send({ type:'unhandledrejection', reason: String((e as any).reason || '') }));
}
