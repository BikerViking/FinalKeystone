import React from 'react'
export default function NotFound(){
  return (
    <main id="main" className="min-h-[100svh] grid place-items-center px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">Page not found</h1>
        <p className="text-muted mt-2">The page you requested does not exist.</p>
        <a href="/" className="inline-block mt-4 border border-white/20 rounded px-4 py-2">Go home</a>
      </div>
    </main>
  )
}
