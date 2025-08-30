import React from 'react';

export function Hero(){
  return (
    <section id="hero" className="min-h-[60svh] grid place-items-center px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold">Keystone Notary Group</h1>
        <p className="mt-3 text-muted">Mobile & remote notary services.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <a href="/appointment" className="px-4 py-2 rounded border">Book Appointment</a>
          <a href="#contact" className="px-4 py-2 rounded border">Contact</a>
        </div>
      </div>
    </section>
  );
}
