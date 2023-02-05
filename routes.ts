/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2022-02-11 13:51:09
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-04 16:37:29
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

      { path: '/position', component: 'position/list' },
      { path: '/position/:bourseCode', component: 'position/detail' },
    ],
  },
];
