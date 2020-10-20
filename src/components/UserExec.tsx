import React, { cloneElement, useEffect } from "react";
import type { Attributes, ReactNode } from "react";

import { Button, Form, Input, Modal } from "antd";

import Executer from "@/js-sdk/web/react/components/Executer";

import { LockOutlined, MailOutlined } from "@ant-design/icons";

export interface TagProp {
  onOk?: (
    formValues?: any,
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => any;
  onCancel?: (
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => any;
  modalProps?: Record<string, any>;
  formProps?: Record<string, any>;
  initVal?: Record<string, any>;
}

function UserModForm(props: TagProp) {
  const {
    onOk = () => {},
    onCancel = () => {},
    modalProps,
    formProps,
    initVal,
  } = props;

  const [form] = Form.useForm();
  const { validateFields, setFieldsValue } = form;

  useEffect(() => {
    setFieldsValue(initVal);
  }, [initVal]);

  return <Modal
    onCancel={onCancel}
    onOk={async (e) => onOk(await validateFields(), e)}
    {...modalProps}
  >
    <Form
      form={form}
      onFinish={onOk}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      {...formProps}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "请输入邮箱地址" },
          { type: "email", message: "请输入正确的邮箱地址" },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="E-Mail"
          allowClear
        />
      </Form.Item>
      <Form.Item
        name="pwd"
        rules={[
          { required: true, message: "密码不能为空" },
          { min: 8, message: "密码最短应为8位" },
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
          allowClear
        />
      </Form.Item>

      <Button htmlType="submit" style={{ display: "none" }}>
        提交
      </Button>,
    </Form>
  </Modal>;
}

// 重载Updata 手动深复制
class UserExec extends Executer {
  Update<P>(
    props?: Partial<P> & Attributes & TagProp,
    ...children: ReactNode[]
  ) {
    const { modalProps: preModalProps, formProps: preFormProps } =
      this.comp.props;

    const { modalProps, formProps } = props || {};

    const merged = {
      modalProps: {
        ...preModalProps,
        ...modalProps,
      },
      formProps: {
        ...preFormProps,
        ...formProps,
      },
    };

    this.comp = cloneElement(
      this.comp,
      { ...props, ...merged },
      ...children,
    );
    return this;
  }
}

export default (options?: TagProp) => {
  return new UserExec(
    <UserModForm {...options} />,
  );
};
