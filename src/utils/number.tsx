/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2021-09-16 15:06:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-01-25 15:18:19
 * @FilePath: /stock/stock-umi/src/utils/number.tsx
 * @Description:
 *
 * Copyright (c) 2023 by fuRan NgeKaworu@gmail.com, All Rights Reserved.
 */
export function safeAdd(a: any, b: any): number {
  return (a || 0) + (b || 0);
}

export function safeDivision(a: any, b: any): number {
  return (a || 0) / (b || 1);
}
