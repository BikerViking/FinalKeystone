import React from 'react';

export function FAQ(){
  const faqs = [
    { q: 'What areas do you cover?', a: 'Lehigh Valley and surrounding counties.' },
    { q: 'Do you offer remote notarization?', a: 'Yes, we support remote online notarization when eligible.' },
    { q: 'What do I need to bring?', a: 'Valid ID and unsigned documents. Do not sign until instructed.' },
  ];
  return (
    <section id="faq" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f, i)=> (
            <details key={i} className="rounded border p-4">
              <summary className="font-semibold">{f.q}</summary>
              <p className="mt-2 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
