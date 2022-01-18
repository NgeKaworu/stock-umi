import { defineConfig } from 'umi';
import theme from './src/theme/';
import routes from './routes';
import base from './src/js-sdk/configs/.umirc.default';

export default defineConfig({
  ...base,
  routes,
  theme,
  title: '加权计算器',
  base: '/stock',
  publicPath: '/micro/stock/',
  devServer: {
    port: 8061,
    proxy: {
      '/api/stock': {
        // target: 'http://localhost:8060',
        target: 'https://api.furan.xyz/stock',
        changeOrigin: true,
        pathRewrite: {
          '/api/stock': '',
        },
      },
    },
  },
});
