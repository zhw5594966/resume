import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'path';
import { Readable } from 'node:stream';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

function getTargetFolder(type: 'image' | 'video' | 'pdf') {
  if (type === 'video') {
    return 'videos';
  }

  if (type === 'pdf') {
    return 'docs';
  }

  return 'images';
}

function portfolioWritePlugin(): Plugin {
  return {
    name: 'portfolio-write-plugin',
    configureServer(server) {
      server.middlewares.use('/__api/portfolio/save', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        try {
          const request = new Request(`http://localhost${req.url ?? ''}`, {
            method: req.method,
            headers: req.headers as HeadersInit,
            body: Readable.toWeb(req) as ReadableStream,
            duplex: 'half',
          } as RequestInit & { duplex: 'half' });

          const formData = await request.formData();
          const manifestRaw = formData.get('manifest');
          if (typeof manifestRaw !== 'string') {
            throw new Error('缺少作品清单数据');
          }

          const manifest = JSON.parse(manifestRaw) as Array<{
            id: string;
            coverSrc: string;
            coverType: 'image' | 'video';
            assets: Array<{ id: string; src: string; type: 'image' | 'video' | 'pdf' }>;
          }>;

          const uploadsRoot = path.resolve(server.config.root, 'public', 'uploads');
          await mkdir(path.join(uploadsRoot, 'images'), { recursive: true });
          await mkdir(path.join(uploadsRoot, 'videos'), { recursive: true });
          await mkdir(path.join(uploadsRoot, 'docs'), { recursive: true });

          for (const project of manifest) {
            const coverFile = formData.get(`cover:${project.id}`);
            if (coverFile instanceof File) {
              const buffer = Buffer.from(await coverFile.arrayBuffer());
              await writeFile(path.join(uploadsRoot, getTargetFolder(project.coverType), path.basename(project.coverSrc)), buffer);
            }

            for (const asset of project.assets) {
              const assetFile = formData.get(`asset:${asset.id}`);
              if (assetFile instanceof File) {
                const buffer = Buffer.from(await assetFile.arrayBuffer());
                await writeFile(path.join(uploadsRoot, getTargetFolder(asset.type), path.basename(asset.src)), buffer);
              }
            }
          }

          await writeFile(path.join(uploadsRoot, 'portfolio-data.json'), JSON.stringify(manifest, null, 2), 'utf8');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ message: '素材与 portfolio-data.json 已写入 public/uploads/。' }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : '写入失败',
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  base: '/resume/',
  plugins: [react(), tailwindcss(), portfolioWritePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
