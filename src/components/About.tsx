import { useState } from 'react';
import { motion } from 'motion/react';

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  const skills = [
    "Unreal Engine 5", "Metahuman", "Niagara", "Blueprints", 
    "State Machine", "PCG", "Motion Matching", "Motion Design",
    "3D Animation", "Lighting & Rendering", "Environment Art", "AI Digital Art"
  ];

  const images = [
    `${baseUrl}about/4.jpg`,
    `${baseUrl}about/3.jpg`,
    `${baseUrl}about/2.jpg`,
    `${baseUrl}about/1.jpg`
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-center overflow-visible">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-0"
        >
          <h2 className="text-4xl md:text-6xl font-serif mb-8 font-bold">关于我<span className="text-[#00f3ff]">.</span></h2>
          <p className="text-gray-300 leading-relaxed mb-6 text-lg">
            本人是数字媒体艺术专业，最初从事三维动画制作、后期制作等技术性岗位，后转岗到创作管理岗位，在筹备食分知酒旗舰店过程中，从策划、创意、设计、制作等创意及技术上提升了很多。
          </p>
          <p className="text-gray-300 leading-relaxed mb-8 text-lg">
            后转型从事虚幻引擎的制作开发，在从事UE美术期间，除了地编工作外，精通Metahuman全流程，Niagara，蓝图，状态机，PCG，Motion Matching，Motion Design等模块均能熟练运用。现能将AI生图生视频运用到大分辨率的影片制作中，在交互项目上，能使用claude code及codex等编程工具极大提升开发效率并能达到预期效果。
          </p>
          
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="px-5 py-2 rounded-full border border-[#00f3ff]/30 text-sm font-bold text-[#00f3ff] bg-[#00f3ff]/5 hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.6)] hover:scale-105 transition-all duration-300 cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-30 mt-12 flex h-[34rem] w-full items-center justify-center overflow-visible md:-ml-[24%] md:mt-0 md:w-[124%]"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00f3ff] to-[#ff0055] opacity-20 blur-3xl -z-10 rounded-full"></div>
          
          {images.map((img, i) => {
            const spreadX = [-405, -135, 135, 405];
            const spreadY = [-150, -150, -150, -150];
            const spreadRotate = [-8, -3, 3, 8];

            // Base offsets for the stacked deck look (Left to Right)
            const xOffset = (i - 1.5) * 72;
            const yOffset = Math.abs(i - 1.5) * 12;
            const rotate = (i - 1.5) * 6;

            let x = xOffset;
            let y = yOffset;
            let r = rotate;
            let scale = 1;
            let z = i;
            let opacity = 1;

            if (isExpanded) {
              x = spreadX[i] ?? xOffset;
              y = spreadY[i] ?? yOffset;
              r = spreadRotate[i] ?? rotate;
              scale = 1;
              z = 60 + i;
              opacity = 1;
            }

            return (
              <motion.div
                key={i}
                className="absolute h-[76%] w-[34%] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                initial={false}
                animate={{ x, y, rotate: r, scale, zIndex: z, opacity }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/80 via-transparent to-transparent z-10"></div>
                <img
                  src={img}
                  alt={`Gallery image ${i + 1}`}
                  className={`w-full h-full object-cover transition-all duration-500 ${isExpanded ? 'mix-blend-normal' : 'mix-blend-luminosity'}`}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
