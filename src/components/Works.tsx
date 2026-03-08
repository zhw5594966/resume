import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Image as ImageIcon, Play, X } from 'lucide-react';
import { defaultProjects } from '../data/defaultProjects';
import type { PortfolioAsset, PortfolioProject } from '../types/portfolio';

const baseUrl = import.meta.env.BASE_URL;

function resolveAssetPath(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }

  return `${baseUrl}${path.replace(/^\/+/, '')}`;
}

function normalizeProjects(rawProjects: PortfolioProject[]) {
  return rawProjects
    .map((project, index) => {
      const assetsFromArray = Array.isArray(project.assets)
        ? project.assets
            .filter((asset) => asset && typeof asset.src === 'string' && typeof asset.type === 'string')
            .map((asset, assetIndex) => ({
              id: asset.id || `${project.id || `project-${index}`}-asset-${assetIndex}`,
              src: asset.src,
              type: asset.type,
              name: asset.name || `${project.title || `作品 ${index + 1}`} - ${assetIndex + 1}`,
            }))
        : [];

      const legacyAsset =
        assetsFromArray.length === 0 && project.mediaSrc && project.mediaType
          ? [
              {
                id: `${project.id || `project-${index}`}-legacy`,
                src: project.mediaSrc,
                type: project.mediaType,
                name: project.title || `作品 ${index + 1}`,
              },
            ]
          : [];

      const assets = [...assetsFromArray, ...legacyAsset] as PortfolioAsset[];
      if (!project || !project.title || !project.category || !project.coverSrc || assets.length === 0) {
        return null;
      }

      return {
        ...project,
        assets,
        coverType: project.coverType || 'image',
        tags: Array.isArray(project.tags) ? project.tags : [],
      };
    })
    .filter(Boolean) as PortfolioProject[];
}

function renderAssetPreview(asset: PortfolioAsset, className: string) {
  if (asset.type === 'video') {
    return (
      <video
        src={resolveAssetPath(asset.src)}
        className={className}
        muted
        loop
        autoPlay
        playsInline
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
      />
    );
  }

  if (asset.type === 'pdf') {
    return (
      <div className={`flex items-center justify-center bg-[#080808] text-white ${className}`}>
        <div className="text-center">
          <FileText size={38} className="mx-auto mb-3 text-[#00f3ff]" />
          <p className="text-sm font-mono tracking-[0.15em] text-white/75">PDF</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={resolveAssetPath(asset.src)}
      alt={asset.name}
      className={className}
      referrerPolicy="no-referrer"
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
    />
  );
}

function renderMainAsset(asset: PortfolioAsset, title: string) {
  if (asset.type === 'video') {
    return (
      <video
        src={resolveAssetPath(asset.src)}
        controls
        autoPlay
        className="w-full h-full object-contain"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
      />
    );
  }

  if (asset.type === 'pdf') {
    return (
      <iframe
        src={`${resolveAssetPath(asset.src)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title={title}
        className="w-full h-full min-h-[70vh] bg-white"
      />
    );
  }

  return (
    <img
      src={resolveAssetPath(asset.src)}
      alt={title}
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
    />
  );
}

export default function Works() {
  const [projects, setProjects] = useState<PortfolioProject[]>(defaultProjects);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await fetch(`${baseUrl}uploads/portfolio-data.json?ts=${Date.now()}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as PortfolioProject[];
        if (!Array.isArray(data) || data.length === 0 || !isMounted) {
          return;
        }

        const normalized = normalizeProjects(data);
        if (normalized.length > 0) {
          setProjects(normalized);
        }
      } catch {
        // Keep the original design and fallback content when no uploaded data exists.
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedProjects = useMemo(() => normalizeProjects(projects), [projects]);
  const currentAsset = selectedProject?.assets[activeAssetIndex] ?? null;

  const openProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    setActiveAssetIndex(0);
  };

  return (
    <section id="works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-serif mb-4 font-bold">
          精选作品<span className="text-[#bf00ff]">.</span>
        </h2>
        <p className="text-[#00f3ff] uppercase tracking-[0.3em] text-sm font-bold drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
          Selected Works
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {normalizedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-gray-900 border border-white/5 hover:border-[#00f3ff] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all duration-500"
            onClick={() => openProject(project)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            {project.coverType === 'video' ? (
              <video
                src={resolveAssetPath(project.coverSrc)}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                muted
                loop
                autoPlay
                playsInline
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
              />
            ) : (
              <img
                src={resolveAssetPath(project.coverSrc)}
                alt={project.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
              />
            )}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
              <span className="text-xs font-mono text-[#00f3ff] mb-2 font-bold tracking-wider drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
                {project.category}
              </span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 group-hover:text-[#ff0055] transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {project.title}
                {project.assets.some((asset) => asset.type === 'video') && (
                  <Play size={16} className="text-[#00f3ff] group-hover:text-[#ff0055] transition-colors" />
                )}
                {project.assets.some((asset) => asset.type === 'pdf') && (
                  <FileText size={16} className="text-[#00f3ff] group-hover:text-[#ff0055] transition-colors" />
                )}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && currentAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl bg-[#0a0a0a] border border-[#00f3ff]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.2)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-[#ff0055] rounded-full text-white transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X size={24} />
              </button>

              <div className="aspect-video w-full bg-black relative">
                {renderMainAsset(currentAsset, selectedProject.title)}
              </div>

              <div className="p-8 bg-gradient-to-b from-[#0a0a0a] to-[#030303]">
                {selectedProject.assets.length > 1 && (
                  <div className="mb-6">
                    <p className="text-xs font-mono uppercase tracking-[0.25em] text-white/45 mb-3">Assets</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {selectedProject.assets.map((asset, assetIndex) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => setActiveAssetIndex(assetIndex)}
                          className={`shrink-0 w-28 h-20 rounded-xl overflow-hidden border transition-all ${
                            activeAssetIndex === assetIndex
                              ? 'border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.25)]'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="relative w-full h-full bg-black">
                            {renderAssetPreview(asset, 'w-full h-full object-cover')}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute right-2 top-2 text-white/80">
                              {asset.type === 'video' ? <Play size={14} /> : asset.type === 'pdf' ? <FileText size={14} /> : <ImageIcon size={14} />}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-sm font-mono text-[#00f3ff] mb-2 block font-bold">{selectedProject.category}</span>
                <h3 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{selectedProject.desc}</p>
                {selectedProject.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
