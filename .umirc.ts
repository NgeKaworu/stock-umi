import { defineConfig } from 'umi';
import theme from './src/theme/';

export default defineConfig({
  qiankun: {
    slave: {},
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      routes: [{ path: '/', component: 'index' }, { redirect: '/' }],
    },
  ],
  theme,
  title: '加权计算器',
  dynamicImport: {
    loading: '@/Loading',
  },
  helmet: false,
  dva: false,
  model: false,
  initialState: false,
  layout: false,
  locale: false,
  preact: false,
  request: false,
  sass: false,
  hash: true,
  base: '/micro/stock',
  publicPath: '/micro/stock/',
  runtimePublicPath: true,
  devServer: {
    port: 80,
    proxy: {
      '/api/stock': {
        target: 'http://stock-go-dev',
        changeOrigin: true,
        pathRewrite: {
          '/api/stock': '',
        },
      },
    },
  },
  externals: {
    moment: 'moment',
  },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        namespace: 'stock',
      },
    ],
  ],
});
