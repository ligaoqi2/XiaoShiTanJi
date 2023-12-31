import { fileURLToPath, URL } from 'node:url'
import { svgBuilder } from './src/plugins/svgBuilder'
import { defineConfig, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  return defineConfig({
    plugins: [vue(), svgBuilder('./src/assets/svg/')],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
