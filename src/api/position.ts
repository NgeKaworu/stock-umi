/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:30:39
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-04 16:33:20
 * @FilePath: /stock/stock-umi/src/api/position.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Tail } from '@/js-sdk/decorators/type';
import { restful } from '@/js-sdk/utils/http';
import { Res } from '@/js-sdk/utils/http/type';
import Role from '@/model/Role';

export const create = (...args: Tail<Parameters<typeof restful.post>>) =>
  restful.post('user-center/role/create', ...args);
export const deleteOne = (id: string, ...args: Tail<Parameters<typeof restful.delete>>) =>
  restful.delete(`user-center/role/remove/${id}`, ...args);
export const update = (...args: Tail<Parameters<typeof restful.put>>) =>
  restful.put('user-center/role/update', ...args);
export const list = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<Role[]>, Res<Role[]>>('user-center/role/list', ...args);

export const validateKey = (...args: Tail<Parameters<typeof restful.get>>) =>
  restful.get<Res<Role[]>, Res<Role[]>>(`user-center/role/validate`, ...args);
