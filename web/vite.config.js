import { fileURLToPath, URL } from 'node:url';
import { svgBuilder } from './src/plugins/svgBuilder';
import { defineConfig, loadEnv } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      svgBuilder('./src/assets/svg/'),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: (i) => `__tla_${i}`
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: `/${loadEnv(mode, process.cwd()).VITE_APP_NAME}`
  });
};
