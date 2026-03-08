import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import type { PortfolioAsset, PortfolioMediaType, PortfolioProject } from '../types/portfolio';

type DraftGalleryAsset = {
  id: string;
  file: File;
  preview: string;
  type: PortfolioMediaType;
  name: string;
};

type DraftAsset = {
  id: string;
  title: string;
  category: string;
  desc: string;
  tags: string;
  coverFile: File | null;
  coverPreview: string;
  coverType: Extract<PortfolioMediaType, 'image' | 'video'>;
  galleryAssets: DraftGalleryAsset[];
};

const baseUrl = import.meta.env.BASE_URL;

const makeDraft = (): DraftAsset => ({
  id: crypto.randomUUID(),
  title: '',
  category: '',
  desc: '',
  tags: '',
  coverFile: null,
  coverPreview: '',
  coverType: 'image',
  galleryAssets: [],
});

function sanitizeFileName(name: string) {
  const dotIndex = name.lastIndexOf('.');
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const ext = dotIndex > 0 ? name.slice(dotIndex) : '';
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${safeBase || 'asset'}${ext.toLowerCase()}`;
}

function detectMediaType(file: File): PortfolioMediaType {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return 'pdf';
  }

  return file.type.startsWith('video/') ? 'video' : 'image';
}

function getTargetFolder(type: PortfolioMediaType) {
  if (type === 'video') {
    return 'videos';
  }

  if (type === 'pdf') {
    return 'docs';
  }

  return 'images';
}

function resolveAssetPath(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }

  return `${baseUrl}${path.replace(/^\/+/, '')}`;
}

function renderAssetPreview(asset: DraftGalleryAsset | { preview: string; type: PortfolioMediaType; name: string }) {
  if (asset.type === 'video') {
    return <video src={asset.preview} className="w-full h-full object-cover" muted loop autoPlay playsInline />;
  }

  if (asset.type === 'pdf') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-center text-white/80">
        <FileText size={34} className="mb-2 text-[#00f3ff]" />
        <span className="px-3 text-xs leading-relaxed break-all">{asset.name}</span>
      </div>
    );
  }

  return <img src={asset.preview} alt={asset.name} className="w-full h-full object-cover" />;
}

function normalizeProjectAssets(project: PortfolioProject): PortfolioAsset[] {
  if (Array.isArray(project.assets) && project.assets.length > 0) {
    return project.assets;
  }

  if (project.mediaSrc && project.mediaType) {
    return [
      {
        id: `${project.id}-legacy`,
        src: project.mediaSrc,
        type: project.mediaType,
        name: project.title,
      },
    ];
  }

  return [];
}

export default function PortfolioUploader() {
  const [items, setItems] = useState<DraftAsset[]>([makeDraft()]);
  const [status, setStatus] = useState<string>('准备导入素材');
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(
    () =>
      items.every(
        (item) => item.title.trim() && item.category.trim() && item.coverFile && item.galleryAssets.length > 0,
      ),
    [items],
  );

  const updateItem = (id: string, patch: Partial<DraftAsset>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    setItems((current) => [...current, makeDraft()]);
  };

  const removeItem = (id: string) => {
    setItems((current) => (current.length === 1 ? current : current.filter((item) => item.id !== id)));
  };

  const handleCoverChange = (id: string, file: File | null) => {
    if (!file) {
      return;
    }

    const type = detectMediaType(file);
    if (type === 'pdf') {
      setStatus('封面不支持 PDF，请选择图片或视频作为封面。');
      return;
    }

    updateItem(id, {
      coverFile: file,
      coverPreview: URL.createObjectURL(file),
      coverType: type,
    });
  };

  const handleGalleryChange = (id: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const nextAssets = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      type: detectMediaType(file),
      name: file.name,
    }));

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, galleryAssets: [...item.galleryAssets, ...nextAssets] } : item,
      ),
    );
  };

  const removeGalleryAsset = (itemId: string, assetId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, galleryAssets: item.galleryAssets.filter((asset) => asset.id !== assetId) }
          : item,
      ),
    );
  };

  const buildManifest = (): PortfolioProject[] =>
    items
      .filter((item) => item.title.trim() && item.category.trim() && item.coverFile && item.galleryAssets.length > 0)
      .map((item) => {
        const coverName = sanitizeFileName(item.coverFile!.name);
        const assets: PortfolioAsset[] = item.galleryAssets.map((asset) => {
          const fileName = sanitizeFileName(asset.file.name);
          return {
            id: asset.id,
            src: `uploads/${getTargetFolder(asset.type)}/${fileName}`,
            type: asset.type,
            name: asset.name,
          };
        });

        return {
          id: item.id,
          title: item.title.trim(),
          category: item.category.trim(),
          desc: item.desc.trim(),
          coverSrc: `uploads/${getTargetFolder(item.coverType)}/${coverName}`,
          coverType: item.coverType,
          tags: item.tags
            .split(/[,，]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
          assets,
        };
      });

  const buildFormData = () => {
    const manifest = buildManifest();
    const formData = new FormData();
    formData.append('manifest', JSON.stringify(manifest));

    for (const item of items) {
      if (!item.coverFile) {
        continue;
      }

      formData.append(`cover:${item.id}`, item.coverFile);
      for (const asset of item.galleryAssets) {
        formData.append(`asset:${asset.id}`, asset.file);
      }
    }

    return formData;
  };

  const downloadManifest = () => {
    const json = JSON.stringify(buildManifest(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'portfolio-data.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus('已下载 portfolio-data.json，可手动放入 public/uploads/。');
  };

  const fetchAsFile = async (path: string, fallbackName: string) => {
    const response = await fetch(resolveAssetPath(path), { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`无法读取文件：${path}`);
    }

    const blob = await response.blob();
    const fileName = path.split('/').pop() || fallbackName;
    return new File([blob], fileName, { type: blob.type || undefined });
  };

  const loadExistingProjects = async () => {
    try {
      setLoadingExisting(true);
      setStatus('正在读取已上传作品...');
      const response = await fetch(`${baseUrl}uploads/portfolio-data.json?ts=${Date.now()}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        setStatus('未找到已上传作品清单。');
        return;
      }

      const projects = (await response.json()) as PortfolioProject[];
      if (!Array.isArray(projects) || projects.length === 0) {
        setStatus('当前没有可编辑的已上传作品。');
        return;
      }

      const loadedItems = await Promise.all(
        projects.map(async (project) => {
          const assets = normalizeProjectAssets(project);
          const coverFile = await fetchAsFile(project.coverSrc, `${project.title}-cover`);
          const galleryAssets = await Promise.all(
            assets.map(async (asset) => {
              const file = await fetchAsFile(asset.src, asset.name);
              return {
                id: asset.id || crypto.randomUUID(),
                file,
                preview: resolveAssetPath(asset.src),
                type: asset.type,
                name: asset.name,
              };
            }),
          );

          return {
            id: project.id || crypto.randomUUID(),
            title: project.title || '',
            category: project.category || '',
            desc: project.desc || '',
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
            coverFile,
            coverPreview: resolveAssetPath(project.coverSrc),
            coverType: project.coverType === 'video' ? 'video' : 'image',
            galleryAssets,
          } satisfies DraftAsset;
        }),
      );

      setItems(loadedItems.length > 0 ? loadedItems : [makeDraft()]);
      setStatus('已加载现有作品，现在可以直接修改并重新写入。');
    } catch (error) {
      setStatus(`读取已上传作品失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoadingExisting(false);
    }
  };

  const saveToProject = async () => {
    if (!canSave) {
      setStatus('请先补全每个作品的标题、分类、封面，并至少添加一个作品素材。');
      return;
    }

    try {
      setSaving(true);
      setStatus('正在写入素材...');
      const response = await fetch('/__api/portfolio/save', {
        method: 'POST',
        body: buildFormData(),
      });

      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(result.error || '写入失败');
      }

      setStatus(result.message || '素材与 portfolio-data.json 已写入 uploads 目录，主站刷新后即可读取。');
    } catch (error) {
      setStatus(`写入失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-[#030303]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-[#00f3ff] uppercase">Local Asset Studio</p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">作品素材导入</h1>
          </div>
          <a
            href={baseUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-mono tracking-wider text-white hover:border-[#00f3ff] hover:text-[#00f3ff] transition-colors"
          >
            <ArrowLeft size={16} />
            返回主站
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
        <section className="glass-panel rounded-3xl p-6 md:p-8 border border-white/8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-2">导入说明</h2>
              <p className="text-gray-300 leading-relaxed">
                这个页面只用于本地整理素材，不改动你已经做好的主站设计。导入完成后会把图片、视频、PDF 写到
                <span className="text-[#00f3ff]"> public/uploads/ </span>
                并生成
                <span className="text-[#00f3ff]"> portfolio-data.json </span>
                ，主站作品区会自动读取。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void loadExistingProjects()}
                disabled={loadingExisting}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:border-[#00f3ff] hover:text-[#00f3ff] transition-colors disabled:opacity-50"
              >
                <Download size={18} />
                {loadingExisting ? '读取中...' : '加载已上传作品'}
              </button>
              <button
                type="button"
                onClick={() => void saveToProject()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00f3ff] to-[#bf00ff] px-5 py-3 text-sm font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? '写入中...' : '写入项目'}
              </button>
              <button
                type="button"
                onClick={downloadManifest}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:border-[#ff0055] hover:text-[#ff0055] transition-colors"
              >
                <Download size={18} />
                下载清单
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 text-sm">
            <p className="text-[#00f3ff]">{status}</p>
            <p className="text-gray-500">
              本地运行 `npm run dev` 时，上传页会直接把素材写入当前项目的
              <span className="font-mono text-white"> public/uploads </span>
              目录，不再需要手动选择目录。
            </p>
            <p className="text-gray-500">
              如果要编辑已有作品，先点
              <span className="font-mono text-white"> 加载已上传作品 </span>
              ，再修改并重新写入。
            </p>
          </div>
        </section>

        {items.map((item, index) => (
          <section key={item.id} className="glass-panel rounded-3xl p-6 md:p-8 border border-white/8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-mono tracking-[0.28em] text-[#ff0055] uppercase">Item {index + 1}</p>
                <h2 className="text-2xl font-serif font-bold">作品条目</h2>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:border-[#ff0055] hover:text-[#ff0055] transition-colors"
              >
                <Trash2 size={16} />
                删除
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm text-gray-300 mb-2">标题</span>
                  <input
                    value={item.title}
                    onChange={(event) => updateItem(item.id, { title: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00f3ff]"
                    placeholder="例如：UE4 制作互动项目"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm text-gray-300 mb-2">分类</span>
                  <input
                    value={item.category}
                    onChange={(event) => updateItem(item.id, { category: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00f3ff]"
                    placeholder="例如：Interactive Experience"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm text-gray-300 mb-2">简介</span>
                  <textarea
                    value={item.desc}
                    onChange={(event) => updateItem(item.id, { desc: event.target.value })}
                    className="w-full min-h-32 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00f3ff]"
                    placeholder="填写作品说明"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm text-gray-300 mb-2">标签</span>
                  <input
                    value={item.tags}
                    onChange={(event) => updateItem(item.id, { tags: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00f3ff]"
                    placeholder="多个标签用逗号分隔"
                  />
                </label>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-sm font-bold text-white">封面素材</p>
                      <p className="text-xs text-gray-500">用于作品卡片展示，可上传图片或视频</p>
                    </div>
                    <label className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm cursor-pointer hover:bg-white/10 transition-colors">
                      <Upload size={16} />
                      选择封面
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(event) => handleCoverChange(item.id, event.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#020202] border border-white/8">
                    {item.coverPreview ? (
                      item.coverType === 'video' ? (
                        <video src={item.coverPreview} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                      ) : (
                        <img src={item.coverPreview} alt="封面预览" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">未选择封面</div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-sm font-bold text-white">作品素材</p>
                      <p className="text-xs text-gray-500">支持多选图片、视频和 PDF，详情弹窗会按素材列表切换查看</p>
                    </div>
                    <label className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm cursor-pointer hover:bg-white/10 transition-colors">
                      <Upload size={16} />
                      添加素材
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,application/pdf"
                        multiple
                        className="hidden"
                        onChange={(event) => handleGalleryChange(item.id, event.target.files)}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {item.galleryAssets.length > 0 ? (
                      item.galleryAssets.map((asset) => (
                        <div key={asset.id} className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#020202] aspect-[4/3]">
                          {renderAssetPreview(asset)}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white/80">
                              {asset.type === 'video' ? <Video size={14} /> : asset.type === 'pdf' ? <FileText size={14} /> : <ImageIcon size={14} />}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeGalleryAsset(item.id, asset.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white hover:bg-[#ff0055]"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full h-32 rounded-2xl border border-white/8 bg-[#020202] flex items-center justify-center text-sm text-gray-500">
                        未添加作品素材
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-full border border-[#00f3ff]/30 px-6 py-3 text-sm font-bold text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-colors"
          >
            <Plus size={18} />
            新增作品条目
          </button>
        </div>
      </main>
    </div>
  );
}
