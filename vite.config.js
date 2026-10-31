import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleSell } from './server/sell.js'

export default defineConfig(({ mode }) => {
  // Loaded server-side only (no VITE_ prefix), so it is never exposed to the browser
  const { SELL_WEBHOOK_URL } = loadEnv(mode, process.cwd(), '')
  const api = server => { server.middlewares.use('/api/sell', (req, res) => handleSell(req, res, SELL_WEBHOOK_URL)) }
  return {
    plugins: [react(), { name: 'sell-api', configureServer: api, configurePreviewServer: api }],
    server: { allowedHosts: true },
  }
})
