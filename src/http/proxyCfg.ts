import { mainHost } from './host';

export default {
  '/main/': {
    target: mainHost,
    pathRewrite: { '^/main/': '/' },
  },
};
