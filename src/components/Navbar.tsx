import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#030303]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="text-2xl font-serif font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          ZHW<span className="text-[#ff0055]">.</span>
        </a>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-mono tracking-wider font-bold">
          <a href="#about" className="text-gray-300 hover:text-[#00f3ff] hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all">ABOUT</a>
          <a href="#experience" className="text-gray-300 hover:text-[#bf00ff] hover:drop-shadow-[0_0_8px_rgba(191,0,255,0.8)] transition-all">EXPERIENCE</a>
          <a href="#works" className="text-gray-300 hover:text-[#ff0055] hover:drop-shadow-[0_0_8px_rgba(255,0,85,0.8)] transition-all">WORKS</a>
          <a href="#contact" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">CONTACT</a>
        </div>
        
        <a 
          href="#contact" 
          className="px-6 py-2.5 rounded-full text-xs font-mono tracking-widest bg-gradient-to-r from-[#00f3ff] to-[#bf00ff] text-white font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] hover:scale-105 transition-all duration-300"
        >
          HIRE ME
        </a>
      </div>
    </motion.nav>
  );
}
