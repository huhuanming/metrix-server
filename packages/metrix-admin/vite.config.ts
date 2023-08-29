import { PluginOption, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

export default defineConfig({
  plugins: [
    react(),
    importToCDN({
      modules: [
        {
          name: 'react',
          var: 'React',
          mode: 'defer',
          path: `umd/react.production.min.js`,
        },
        {
          name: 'react-dom',
          var: 'ReactDOM',
          mode: 'defer',
          path: `umd/react-dom.production.min.js`,
        },
        {
          name: 'dayjs',
          var: 'dayjs',
          mode: 'defer',
          path: `dayjs.min.js`,
        },
        {
          name: 'antd',
          var: 'antd',
          mode: 'defer',
          path: `dist/antd.min.js`,
        },
        {
          name: 'lodash',
          var: '-',
          mode: 'defer',
          path: `lodash.min.js`,
        },
        {
          name: 'bignumber.js',
          var: 'BigNumberJS',
          mode: 'defer',
          path: `bignumber.min.js`,
        },
        {
          name: '@ant-design/icons',
          var: 'icons',
          mode: 'defer',
          path: `dist/index.umd.min.js`,
        },
        {
          name: '@ant-design/charts',
          var: 'Charts',
          mode: 'defer',
          path: `dist/charts.min.js`,
        },
        {
          name: 'curve-matcher',
          var: 'CurveMatcher',
          mode: 'defer',
          path: `dist/index.umd.min.js`,
        },
        {
          name: '@ant-design/plots',
          var: 'AntDesignPlots',
          mode: 'defer',
          path: `dist/plots.min.js`,
        },
      ]
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
      }
    }
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('react-router')) {
            return 'react-router'
          } else if (id.includes('react')) {
            return 'react-libs'
          } else if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
