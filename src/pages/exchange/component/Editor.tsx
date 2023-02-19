/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:14:33
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-05 14:48:49
 * @FilePath: /stock/stock-umi/src/pages/position/detail/component/Editor.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { DatePicker, Form, Input, InputNumber, Typography } from 'antd';

import ModalForm from '@/js-sdk/components/ModalForm';
import type useModalForm from '@/js-sdk/components/ModalForm/useModalForm';

import { update, create } from '@/api/position';
import moment from 'moment';

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
      formProps={{
        onFinish: onSubmit,
        initialValues: {
          createAt: moment(),
        },
        ...formProps,
      }}
      modalProps={{ onOk: onSubmit, ...modalProps }}
    >
      <Item name="createAt" label="成交时间" rules={[{ required: true }]}>
        <DatePicker placeholder="请选择" showTime />
      </Item>
      <Item name="transactionPrice" label="成交价" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
      <Item name="currentShare" label="成交股份" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
      <Item name="currentDividend" label="本次派息" rules={[{ required: true }]}>
        <InputNumber placeholder="请输入" />
      </Item>
      <Item name="stopLoss" label="当前总收益">
        <InputNumber placeholder="请输入" disabled />
      </Item>
      <Item name="stopLoss" label="交易后总收益">
        <InputNumber placeholder="请输入" disabled />
      </Item>
      <Item name="stopLoss" label="当前收益率">
        <InputNumber placeholder="请输入" disabled />
      </Item>
      <Item name="stopLoss" label="交易后收益率">
        <InputNumber placeholder="请输入" disabled />
      </Item>
    </ModalForm>
  );
};
