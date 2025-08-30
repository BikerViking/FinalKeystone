import React from 'react';

export function Services(){
  const items = [
    { title: 'General Notary', body: 'Acknowledgments, jurats, oaths, and more.' },
    { title: 'Real Estate', body: 'Refis, purchases, HELOCs, and loan packages.' },
    { title: 'Estate & Family', body: 'POA, wills, affidavits, consent forms.' },
    { title: 'Business', body: 'Contracts, vendor forms, compliance docs.' },
    { title: 'Remote Online Notary', body: 'Convenient and secure online notarization.' },
    { title: 'After-hours Mobile', body: 'We come to you, 7 days a week.' },
  ];
  return (
    <section id="services" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, idx)=> (
            <article key={idx} className="rounded-xl border p-6">
              <h3 className="text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-muted">{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
