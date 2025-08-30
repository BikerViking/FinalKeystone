import React from 'react';

export function CTA(){
  return (
    <section id="cta" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Ready to notarize your documents?</h2>
        <p className="mt-2 text-muted">Fast scheduling. Professional service.</p>
        <a href="/appointment" className="inline-block mt-6 px-5 py-3 rounded border">Book Now</a>
      </div>
    </section>
  );
}
