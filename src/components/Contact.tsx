import { motion } from 'motion/react';
import { Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 border-t border-gray-900 bg-[#020202]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-8">联系我<span className="text-gray-600">.</span></h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
            寻找游戏场景、UE美术、数字人、AI影片与视觉相关的机会。期待与您合作，共同创造令人惊叹的视觉体验。
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
              <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center bg-gray-900/50">
                <Phone size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="font-mono">153 3886 0433</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
              <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center bg-gray-900/50">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                <p className="font-mono">Shenzhen, China</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="mt-24 text-center text-gray-600 text-sm font-mono">
        <p>© {new Date().getFullYear()} Zhang Huaiwen. All rights reserved.</p>
      </div>
    </section>
  );
}
