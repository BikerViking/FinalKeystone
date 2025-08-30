import React from 'react';

export default function Appointment(){
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      <p className="text-muted">Use the contact form below or call us to schedule.</p>
      <form className="mt-6 grid gap-4">
        <input className="rounded border p-3" placeholder="Name" required />
        <input className="rounded border p-3" placeholder="Email" type="email" required />
        <textarea className="rounded border p-3" placeholder="Message" rows={5} required />
        <button className="rounded border px-5 py-3" type="submit">Send Request</button>
      </form>
    </main>
  );
}
