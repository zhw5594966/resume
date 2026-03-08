import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Works from './components/Works';
import Contact from './components/Contact';
import PortfolioUploader from './components/PortfolioUploader';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isUploadMode = params.get('mode') === 'upload';

  if (isUploadMode) {
    return <PortfolioUploader />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gray-800 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Works />
      </main>
      <Contact />
    </div>
  );
}
