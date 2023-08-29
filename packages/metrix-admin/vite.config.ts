import { PluginOption, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

function unpkgPlugin(): PluginOption {
  return {
    name: 'vite-plugin-react-cdn',
    enforce: 'pre',
    config(config) {
      config.build = config.build || {}
      const { build } = config;
      if (build) {
        build.rollupOptions = {
          ...build.rollupOptions,
          external: [
            'react',
            'react-dom',
            'antd',
            'lodash',
            'react-router-dom',
            'bignumber.js',
            '@ant-design/icons',
            '@ant-design/pro-layout',
            '@ant-design/pro-components',
            '@ant-design/charts',
            '@ant-design/plots',
            'curve-matcher',
          ],
        };
      }
    },
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        return html.replace(
          '</head>',
          `
          <script crossorigin defer src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script crossorigin defer src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <script crossorigin defer src="https://unpkg.com/antd@5.8.5/dist/antd.min.js"></script>
          <script crossorigin defer src="https://unpkg.com/react-router-dom@6.15.0/dist/umd/react-router-dom.production.min.js"></script>
          <script crossorigin defer src="https://unpkg.com/lodash@4.17.21/lodash.min.js"></script>
          <script crossorigin defer src="https://unpkg.com/bignumber.js@9.1.2/bignumber.js"></script>
          <script crossorigin defer src="https://unpkg.com/@ant-design/icons@5.2.5/dist/index.umd.min.js"></script>
          <script crossorigin defer src="https://cdn.jsdelivr.net/npm/@ant-design/pro-layout@7.16.10/lib/index.min.js"></script>
          <script crossorigin defer src="https://cdn.jsdelivr.net/npm/@ant-design/pro-components@2.6.13/lib/index.min.js"></script>
          <script crossorigin defer src="https://cdn.jsdelivr.net/npm/@ant-design/charts@1.4.2/dist/charts.min.js"></script>
          <script crossorigin defer src="https://cdn.jsdelivr.net/npm/@ant-design/plots@1.2.5/dist/plots.min.js"></script>
          <script crossorigin defer src="https://cdn.jsdelivr.net/npm/curve-matcher@1.1.1/dist/index.umd.min.js"></script>
          </head>
        `
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    unpkgPlugin(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
      }
    }
  },
})
