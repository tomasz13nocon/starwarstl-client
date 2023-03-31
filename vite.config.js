import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  // build.outDir and publicDir are relative to the `root`
  root: 'src',
  build: {
    outDir: '../dist',
  },
  publicDir: '../public',
  plugins: [react({})],
})
