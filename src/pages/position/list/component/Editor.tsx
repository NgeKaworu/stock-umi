/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:14:33
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-04 18:05:58
 * @FilePath: /stock/stock-umi/src/pages/position/list/component/Editor.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Form, Input, InputNumber, Typography } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update, create } from '@/api/position';

const { Item } = Form;
const { Link } = Typography;

export default ({
  formProps,
  modalProps,
  setModalProps,
  onSuccess,
  form,
}: ReturnType<typeof useModalForm> & {
  onSuccess?: (...args: any) => void;
}) => {
  const inEdit = modalProps?.title === '编辑';

  async function onSubmit() {
    const value = await form?.validateFields();
    try {
      setModalProps((pre) => ({ ...pre, confirmLoading: true }));
      let api;
      if (inEdit) {
        api = update;
      } else {
        api = create;
      }

      await api(value);
      await onSuccess?.();
      setModalProps((pre) => ({ ...pre, visible: false }));
      form.resetFields();
    } finally {
      setModalProps((pre) => ({ ...pre, confirmLoading: false }));
    }
  }

  return (
    <ModalForm
      formProps={{ onFinish: onSubmit, ...formProps }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="stopProfit" label="止盈点" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
      <Item name="stopLoss" label="止损点" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
    </ModalForm>
  );
};
