import { motion } from 'motion/react';

const experiences = [
  {
    period: "2024.3 - 至今",
    company: "深圳艾森视讯有限公司",
    role: "三维部门组长",
    desc: "负责展厅沉浸式空间、球幕影片制作。用AI结合3D制作高分辨率沉浸式数字内容，用AI编程实现交互。负责研学课程，主题影片的前期策划，数字人资产制作，场景地编，物体模型贴图制作，渲染后期合成，以及带领团队以每月一部5分钟以上的沉浸式影片的制作。推进团队和公司进入全AI流程，实现建模，贴图，渲染，后期与AI的深度结合"
  },
  {
    period: "2024.08 - 2024.3",
    company: "粤港澳大湾区数字研究院IDEA",
    role: "项目顾问",
    desc: "基于自研大模型训练的AI数字人，从模型，绑定，毛发，驱动流程的全部工作。用蓝图驱动机器人实现物体搬运动作。对接后台算法，给集装箱物品最优排列。"
  },
  {
    period: "2022.04 - 2024.08",
    company: "软通动力 (华为元宇宙项目)",
    role: "UE美术",
    desc: "基于虚幻引擎搭建华为元宇宙项目的场景、灯光、材质、渲染等UE美术工作。精通并使用UE5制作高保真场景，负责材质、灯光渲染输出，制作超写实视频。制作华为项目的数字人，包括卡通数字人，超写实数字人。参与XR Platform项目、捏脸自研项目、云笙超写实数字人项目等。"
  },
  {
    period: "2021.04 - 2022.04",
    company: "深圳华侨城文化旅游科技股份有限公司",
    role: "项目经理",
    desc: "负责主题公园互动项目策划、统筹。筹建UE团队制作互动项目。带领并参与特种项目，在公司首次使用UE引擎离线渲染，将UE制作整合进传统制作流程。统筹团队制作虚拟偶像，利用UE引擎渲染直播IP角色。"
  },
  {
    period: "2018.08 - 2021.03",
    company: "深圳市食分知酒餐饮娱乐管理有限公司",
    role: "技术总监",
    desc: "负责旗舰店选址、品牌定位、空间设计、玩法设计等前期筹备工作；结合数字科技和新媒体艺术等形式，运用全息投影，裸眼3D，3dmapping，沉浸式空间，体感互动等多元化新型手段，打造全新娱乐方式。"
  },
  {
    period: "2016.08 - 2018.08",
    company: "千度文化传媒（深圳）有限公司",
    role: "技术总监",
    desc: "负责数字餐厅360°环幕投影、桌面投影、全息投影内容制作及团队任务分配。从编剧、美术、台本、模型、动画、特效、后期全流程监管和把控。"
  },
  {
    period: "2013.06 - 2016.08",
    company: "深圳水体集团",
    role: "动画设计",
    desc: "负责投标项目喷泉方案设计，效果图制作，三维动画制作。先后完成钦州白石湖喷泉水幕电影内容制作，福建正荣财富中心音乐喷泉设计与三维动画等。组建团队班子，完善制度。"
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-serif mb-4 font-bold">工作经历<span className="text-[#ff0055]">.</span></h2>
        <p className="text-[#00f3ff] uppercase tracking-[0.3em] text-sm font-bold drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">12年行业深耕</p>
      </motion.div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-[#00f3ff] before:via-[#bf00ff] before:to-[#ff0055] before:opacity-30">
        {experiences.map((exp, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#ff0055] bg-[#030303] text-[#00f3ff] group-hover:bg-[#ff0055] group-hover:text-white group-hover:shadow-[0_0_20px_#ff0055] group-hover:scale-110 transition-all duration-300 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#030303] z-10">
              <div className="w-3 h-3 bg-current rounded-full shadow-[0_0_10px_currentColor]"></div>
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-2xl glass-panel group-hover:border-[#00f3ff]/50 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f3ff] to-[#ff0055] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                <h3 className="font-bold text-xl text-white group-hover:text-[#00f3ff] transition-colors">{exp.company}</h3>
                <span className="text-xs font-mono text-white font-bold bg-gradient-to-r from-[#bf00ff] to-[#ff0055] px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,0,85,0.4)]">{exp.period}</span>
              </div>
              <h4 className="text-lg text-[#00f3ff] mb-4 font-serif italic font-semibold">{exp.role}</h4>
              <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                {exp.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
