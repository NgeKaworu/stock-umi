import React, { cloneElement, useEffect } from "react";
import type { Attributes, ReactNode } from "react";

import { Form, Modal, Button, Input } from "antd";

import Executer from "@/js-sdk/web/react/components/Executer";
import { SketchPicker } from "react-color";

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

function TagModForm(props: TagProp) {
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
        name="name"
        rules={[
          { required: true, message: "标签名不能为空" },
        ]}
        label="标签名"
      >
        <Input
          placeholder="标签名"
          allowClear
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        valuePropName="color"
        name="color"
        rules={[
          { required: true, message: "请选个颜色" },
        ]}
        label="颜色"
      >
        <SketchPicker
          width="unset"
          disableAlpha
          presetColors={[
            "#f5222d",
            "#fa541c",
            "#fa8c16",
            "#faad14",
            "#fadb14",
            "#a0d911",
            "#52c41a",
            "#13c2c2",
            "#1890ff",
            "#2f54eb",
            "#722ed1",
            "#eb2f96",
          ]}
        />
      </Form.Item>

      <Button htmlType="submit" style={{ display: "none" }}>
        提交
      </Button>,
    </Form>
  </Modal>;
}

// 重载Updata 手动深复制
class TagExec extends Executer {
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
  return new TagExec(
    <TagModForm {...options} />,
  );
};
