import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Explosive vibrant background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff0055] rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00f3ff] rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-[#bf00ff] rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[#030303]/40 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="relative mb-6 md:mb-4"
        >
          <h1 className="text-6xl sm:text-7xl md:text-[10rem] font-serif font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-[#bf00ff] to-[#ff0055] drop-shadow-[0_0_30px_rgba(255,0,85,0.4)] leading-tight">
            张怀文
          </h1>
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00f3ff] via-[#bf00ff] to-[#ff0055] opacity-20 blur-2xl -z-10 rounded-full"></div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-base sm:text-lg md:text-2xl text-white font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase mb-16 md:mb-12 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] flex flex-wrap justify-center gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-2 mt-4"
        >
          <span>资深UE美术</span>
          <span className="text-[#ff0055] opacity-50">/</span>
          <span>3D动画</span>
          <span className="text-[#ff0055] opacity-50">/</span>
          <span>数字人专家</span>
          <span className="text-[#ff0055] opacity-50">/</span>
          <span className="text-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">AI数字艺术</span>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-[15vh] md:bottom-[25vh] z-20"
      >
        <a href="#about" className="flex flex-col items-center text-[#00f3ff] hover:text-[#ff0055] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
          <span className="text-xs tracking-[0.3em] mb-3 uppercase font-bold">Discover</span>
          <ChevronDown className="animate-bounce" size={24} />
        </a>
      </motion.div>
    </section>
  );
}
