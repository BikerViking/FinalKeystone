import React from 'react';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { Credentials } from './sections/Credentials';
import { Coverage } from './sections/Coverage';
import { Testimonials } from './sections/Testimonials';
import { CTA } from './sections/CTA';
import { FAQ } from './sections/FAQ';
import { Contact } from './sections/Contact';
import { ChatWidget } from './widgets/ChatWidget';

export default function App() {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <Services />
        <Credentials />
        <Coverage />
        <Testimonials />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <ChatWidget />
    </>
  );
}
