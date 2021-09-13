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
  favicon: './assets/favicon.ico',

  hash: true,
  base: '/stock',
  publicPath: '/stock/',
  runtimePublicPath: true,
  externals: {
    moment: 'moment',
  },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        namespace: 'to-do-list',
      },
    ],
  ],
});
