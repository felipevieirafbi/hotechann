import fs from 'fs';
import path from 'path';

let viteConfig = fs.readFileSync('vite.config.ts', 'utf8');

if (!viteConfig.includes('server: {')) {
   const proxyStr = `
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true }
    }
  },
  `;
   // Not technically needed since we do middleware inside one server, but we will add it anyway to be thorough,
   // actually, if we use the same server, proxy isn't strictly needed if we just attach API routes.
}
