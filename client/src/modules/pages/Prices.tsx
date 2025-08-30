import React from 'react';

export default function Prices(){
  const items = [
    { name: 'Acknowledgment / Jurat', price: '$10 per seal' },
    { name: 'Loan package (mobile)', price: 'Quoted' },
    { name: 'Travel fee', price: 'Varies by distance/time' },
  ];
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Prices</h1>
      <ul className="space-y-3">
        {items.map((it,i)=> (
          <li key={i} className="flex justify-between rounded border p-3">
            <span>{it.name}</span>
            <span>{it.price}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
