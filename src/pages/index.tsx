import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import {
  Button,
  Divider,
  Empty,
  Form,
  InputNumber,
  PageHeader,
  Select,
  Spin,
} from "antd";

import { HomeOutlined, InfoCircleOutlined } from "@ant-design/icons";

import theme from "@/theme";
import moment from "moment";

import { Annals, CurrentInfo, InfoTime } from "@/models/stock";

interface rootState {
  stock: {
    listDate: InfoTime[];
    annalsList: Annals[];
    currentList: CurrentInfo[];
  };
  loading: {
    models: { record: boolean };
  };
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  
`;

const Title = styled.div`
  margin: 24px 0 12px;
  padding: 0  16px;
  line-height: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 24px;
  font-weight: 500;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: scroll;
  margin: 0 16px;
`;

export default () => {
  const [form] = Form.useForm();

  const { listDate } = useSelector((s: rootState) => ({
    listDate: s.stock.listDate,
  }));

  console.log(listDate);

  const dispatch = useDispatch();

  async function submit(values?: any) {
    const v = values || await form.validateFields();
    try {
    } catch (e) {
      console.error("create err: ", e);
    }
  }

  return (
    <Wrap>
      <Title><HomeOutlined style={{ marginRight: "8px" }} />权重设置</Title>
      <Content>
        <Form
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={submit}
        >
          <Form.Item label="年报更新于">
            {true ? "123" : <a>没有数据？重新加载！</a>}
          </Form.Item>
          <Form.Item
            label="现值数据源"
            rules={[
              { required: true, message: "该字段必填" },
            ]}
            name="curDate"
          >
            <Select
              notFoundContent={<a
                onClick={async () => {
                  try {
                    await dispatch({ type: "stock/listInfoTime" });
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                没有数据？重新加载！
              </a>}
            >
              {listDate.map((t) =>
                <Select.Option key={t._id} value={t._id}>
                  {moment(t._id).format("YYYY-MM-DD HH:mm:ss")}
                </Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="dr"
            label="贴现率"
            rules={[
              { required: true, message: "该字段必填" },
            ]}
            tooltip={{
              title:
                "贴现率（Discount Rate） = 风险收益率（Rate of Risked Return） + 通货（CPI） + 无风险利率（The risk-free rate of interest）",
              icon: <InfoCircleOutlined />,
            }}
          >
            <InputNumber min={0} step={0.01}></InputNumber>
          </Form.Item>
          <div>
            权重遵守以下规则：
            <br />- 整数
            <br />- 如果希望该权重越小越好，请用负值
            <br />- 空代表跳过跳过
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Form.Item
              name="pb"
              label="市净率（PB）"
              tooltip={{
                title: "市净率（PB） = 市值 / 净资产 （反映市场预期）",
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber step={1}></InputNumber>
            </Form.Item>

            <Form.Item
              name="pe"
              label="市盈率（PE）"
              tooltip={{
                title: "市盈率PE = 市值 / 净利润 （反映回本时间）",
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber step={1}></InputNumber>
            </Form.Item>

            <Form.Item
              name="aagr"
              label="平均年增长率"
              tooltip={{
                title: "去年增长率的平均",
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber step={1}></InputNumber>
            </Form.Item>

            <Form.Item
              name="peg"
              label="市盈增长比（PEG）"
              tooltip={{
                title: "市盈增长比PEG = PE / 平均年增长率",
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber step={1}></InputNumber>
            </Form.Item>

            <Form.Item
              name="dcer"
              label="动态现金估值比"
              tooltip={{
                title: "动态现金估值比 = 动态现金估值 / 现值",
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber step={1}></InputNumber>
            </Form.Item>

            <Form.Item
              name="dper"
              label="动态利润估值比"
              tooltip={{
                title: "动态利润估值比 = 动态利润估值 / 现值",
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber step={1}></InputNumber>
            </Form.Item>

            <Form.Item
              name="roe"
              label="净资产收益率（ROE）"
              tooltip={{
                title: "净资产收益率ROE = 净利润 / 净资产 (盈利能力)",
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber step={1}></InputNumber>
            </Form.Item>
          </div>
          <Button style={{ display: "none" }} htmlType="submit"></Button>
        </Form>
      </Content>
      <Button size="large" type="primary" onClick={() => submit()}>计算</Button>
    </Wrap>
  );
};
