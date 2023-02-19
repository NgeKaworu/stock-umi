/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2022-02-11 13:51:09
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-13 15:55:08
 * @FilePath: /stock/stock-umi/routes.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export default [
  {
    path: '/',
    component: '@/layout/',
    routes: [
      { path: '/', component: 'stock' },
      { path: '/lab', component: 'lab' },

      { path: '/position', component: 'position' },
      { path: '/exchange/:bourseCode', component: 'exchange' },
    ],
  },
];
