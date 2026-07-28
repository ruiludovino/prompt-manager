import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'node:os'
import path from 'node:path'

// Cache dir is moved outside the Dropbox-synced project folder: Dropbox's
// file watcher locks files during Vite's dep-optimizer renames, causing
// intermittent EBUSY errors when node_modules/.vite lives inside Dropbox.
export default defineConfig({
  plugins: [react()],
  cacheDir: path.join(os.tmpdir(), 'vite-cache-promptvault'),
})
