import type { PortfolioProject } from '../types/portfolio';

export const defaultProjects: PortfolioProject[] = [
  {
    id: 'huawei-metaverse',
    title: '华为元宇宙项目',
    category: 'UE5 Scene & Rendering',
    coverSrc: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
    coverType: 'image',
    desc: '基于虚幻引擎搭建华为元宇宙项目的场景、灯光、材质、渲染等 UE 美术工作。制作高保真场景，超写实视频。',
    tags: ['UE5', '场景', '渲染'],
    assets: [
      {
        id: 'huawei-video',
        src: 'https://cdn.pixabay.com/video/2023/10/15/185093-874635103_large.mp4',
        type: 'video',
        name: '华为元宇宙演示',
      },
    ],
  },
  {
    id: 'yunsheng-human',
    title: '云笙超写实数字人',
    category: 'Metahuman',
    coverSrc: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop',
    coverType: 'image',
    desc: '负责头部材质、眼球材质调优，让云笙成为更接近 MetaHuman 级别的数字人，配置渲染环境和灯光，使数字人真实可信。',
    tags: ['数字人', 'MetaHuman', '角色'],
    assets: [
      {
        id: 'yunsheng-image',
        src: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop',
        type: 'image',
        name: '云笙数字人',
      },
    ],
  },
  {
    id: 'immersive-space',
    title: '展厅沉浸式空间',
    category: 'Immersive Space',
    coverSrc: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    coverType: 'image',
    desc: '负责展厅沉浸式空间、球幕影片制作。主题影片的前期策划，数字人资产制作，场景地编，渲染后期合成。',
    tags: ['沉浸式', '球幕', '空间'],
    assets: [
      {
        id: 'immersive-video',
        src: 'https://cdn.pixabay.com/video/2020/04/09/35882-408920117_large.mp4',
        type: 'video',
        name: '沉浸式空间影片',
      },
    ],
  },
  {
    id: 'ai-human-drive',
    title: 'AI数字人驱动',
    category: 'AI & Animation',
    coverSrc: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    coverType: 'image',
    desc: '基于自研大模型训练的 AI 数字人，从模型、绑定、毛发到驱动流程的全部工作。',
    tags: ['AI', '数字人', '动画'],
    assets: [
      {
        id: 'ai-human-image',
        src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
        type: 'image',
        name: 'AI 数字人概念图',
      },
    ],
  },
  {
    id: 'theme-park',
    title: '主题公园互动项目',
    category: 'Interactive Experience',
    coverSrc: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    coverType: 'image',
    desc: '负责主题公园互动项目策划、统筹。将 UE 制作整合进传统制作流程，建立 UE 制作流程和制度。',
    tags: ['互动', '体验', '策划'],
    assets: [
      {
        id: 'theme-park-image',
        src: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
        type: 'image',
        name: '互动项目概念图',
      },
    ],
  },
  {
    id: 'mapping',
    title: '全息投影与 3D Mapping',
    category: 'Holographic & Mapping',
    coverSrc: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    coverType: 'image',
    desc: '结合数字科技和新媒体艺术，运用全息投影、裸眼 3D、3D Mapping，打造全新娱乐方式。',
    tags: ['投影', 'Mapping', '新媒体'],
    assets: [
      {
        id: 'mapping-video',
        src: 'https://cdn.pixabay.com/video/2019/11/14/29013-372960616_large.mp4',
        type: 'video',
        name: '3D Mapping 演示',
      },
    ],
  },
];
