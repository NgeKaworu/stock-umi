import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import styled from "styled-components";

import { Button, Col, Form, InputNumber, Row, Select } from "antd";

import {
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import moment from "moment";

import { CurrentInfo, Enterprise, InfoTime, Stock } from "@/models/stock";
import { SafeNumber } from "@/utils/Number";
import { UserSchema } from "@/models/user";

import UserExec from "@/components/UserExec";
interface rootState {
  stock: {
    listDate: InfoTime[];
    enterpriseList: Enterprise[];
  };
  user: UserSchema;
  loading: {
    global: boolean;
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

const FixedPanel = styled.div`
  position: fixed;
  bottom: 8vh;
  right: 8vw;
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 8px;
  };

  > *:last-child {
    margin-bottom: 0
  };
`;

export default () => {
  const [calcLoading, setCalcLoading] = useState(false);
  const [form] = Form.useForm();

  const { listDate, enterpriseList, isLoading, user } = useSelector((
    s: rootState,
  ) => ({
    listDate: s.stock.listDate,
    enterpriseList: s.stock.enterpriseList,
    isLoading: s.loading.global,
    user: s.user,
  }));

  const dispatch = useDispatch();
  const history = useHistory();

  const userExec = UserExec({
    modalProps: { title: "管理员登录" },
    onOk: async (formValues?: any) => {
      try {
        userExec?.Update({
          modalProps: {
            confirmLoading: true,
          },
        }).Execute();

        await dispatch({
          type: "user/login",
          payload: formValues,
        });
        await dispatch({ type: "user/profile" });

        userExec?.Update({
          modalProps: {
            visible: false,
          },
        }).Execute();
      } catch (e) {
        console.error(e);
      } finally {
        userExec?.Update({
          modalProps: {
            confirmLoading: false,
          },
        }).Execute();
      }
    },
    onCancel: () => {
      userExec.Update({
        modalProps: {
          visible: false,
        },
      }).Execute();
    },
  });

  useLayoutEffect(() => {
    return () => {
      userExec.Destroy();
    };
  }, [userExec]);

  async function submit(values?: any) {
    setCalcLoading(true);
    const v = values || await form.validateFields();
    try {
      localStorage.setItem("weight", JSON.stringify(v));
      const { curDate, dr, ...weights } = v;
      const curInfo: any = await dispatch(
        { type: "stock/listCurrent", payload: curDate },
      );

      // 流程是 计算基本参数 然后 计算估值 然后权重排序
      let tempenterprise = [...enterpriseList];
      const discounted: Stock[] = [];
      await Promise.all(
        curInfo.map((info: CurrentInfo) =>
          new Promise((res) =>
            // requestIdleCallback 使用这个方式不阻塞dom渲染
            window.requestIdleCallback(() => {
              const [enterprise, remaining] = tempenterprise.reduce(
                (acc: [Enterprise[], Enterprise[]], cur) => {
                  const [e, r] = acc;
                  return cur.code === info.code
                    ? [e.concat(cur), r]
                    : [e, r.concat(cur)];
                },
                [[], []],
              );
              // 剩下的还给temp，减少剩余循环次数
              tempenterprise = remaining;
              const stock = new Stock();

              stock.CurrentInfo = info;
              stock.Enterprise = enterprise;

              stock.Calc().Discount(dr);
              discounted.push(stock);
              res();
            })
          )
        ),
      );

      const keys = Object.keys(weights);
      const sum: number = Object.values(weights).reduce(
        (acc: number, cur: any) =>
          Boolean(cur) ? acc + Math.abs((cur as number)) : acc,
        0,
      );

      for (let i = 0; i < keys.length; ++i) {
        const k = weights[keys[i]];
        if (!k) continue;

        discounted.sort((a: any, b: any) => b[k] - a[k]);
        const weight = k / sum;
        let j = discounted.length;
        while (j--) {
          discounted[j].Grade = SafeNumber(discounted?.[j]?.Grade) +
            ((j + 1) * weight);
        }
      }

      discounted.sort((a, b) => SafeNumber(b.Grade) - SafeNumber(a.Grade));

      history.push({ pathname: "/result/", state: discounted });
    } catch (e) {
      console.error("create err: ", e);
    } finally {
      setCalcLoading(false);
    }
  }

  function getInit() {
    try {
      const w = localStorage.getItem("weight");
      if (w) {
        return JSON.parse(w);
      }
    } catch (e) {
      console.error(e);
      localStorage.removeItem("weight");
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
          initialValues={getInit()}
        >
          <Form.Item label="年报更新于">
            {enterpriseList?.[0]?.CreateDate
              ? moment(enterpriseList?.[0]?.CreateDate).format(
                "YYYY-MM-DD hh:mm:ss",
              )
              : <a
                onClick={async () => {
                  try {
                    await dispatch({ type: "stock/listEnterprise" });
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                没有数据？重新加载！
              </a>}
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
            <br />- 权重表示：该参数占整体的比例；
            <br />- 如果希望该权重以降序排序，请用负值；
            <br />- 空代表跳过跳过；
          </div>
          <Row>
            <Col xs={12} sm={8} md={6} lg={4} xl={2} xxl={1}>
              <Form.Item
                name="PB"
                label="市净率（PB）"
                tooltip={{
                  title: "市净率（PB） = 市值 / 净资产 （反映市场预期）",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <InputNumber step={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={2} xxl={1}>
              <Form.Item
                name="PE"
                label="市盈率（PE）"
                tooltip={{
                  title: "市盈率PE = 市值 / 净利润 （反映回本时间）",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <InputNumber step={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={2} xxl={1}>
              <Form.Item
                name="AAGR"
                label="平均年增长率"
                tooltip={{
                  title: "去年增长率的平均",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <InputNumber step={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={2} xxl={1}>
              <Form.Item
                name="PEG"
                label="市盈增长比（PEG）"
                tooltip={{
                  title: "市盈增长比PEG = PE / 平均年增长率",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <InputNumber step={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={2} xxl={1}>
              <Form.Item
                name="DCER"
                label="现金估值比(动)"
                tooltip={{
                  title: "现金估值比(动) = 现金估值(动) / 现值",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <InputNumber step={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={2} xxl={1}>
              <Form.Item
                name="DPER"
                label="利润估值比(动)"
                tooltip={{
                  title: "利润估值比(动) = 利润估值(动) / 现值",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <InputNumber step={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={2} xxl={1}>
              <Form.Item
                name="ROE"
                label="净资产收益率（ROE）"
                tooltip={{
                  title: "净资产收益率ROE = 净利润 / 净资产 (盈利能力)",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <InputNumber step={1}></InputNumber>
              </Form.Item>
            </Col>
          </Row>
          <Button style={{ display: "none" }} htmlType="submit"></Button>
        </Form>
      </Content>
      <Button
        loading={isLoading || calcLoading}
        size="large"
        type="primary"
        onClick={() => submit()}
      >
        {isLoading || calcLoading ? "数据计算量大，请耐心等待" : "计算"}
      </Button>
      <FixedPanel>
        {!user?.id
          ? <Button
            shape="circle"
            type="primary"
            icon={<UserOutlined />}
            onClick={() => {
              userExec.Update({
                modalProps: {
                  visible: true,
                },
              }).Execute();
            }}
            loading={isLoading}
          >
          </Button>
          : <>
            <Button
              shape="circle"
              type="primary"
              onClick={() => {
                dispatch({ type: "user/logout" });
              }}
              loading={isLoading}
            >
              {isLoading || "退"}
            </Button>
            <Button
              shape="circle"
              type="primary"
              onClick={() => {
                dispatch({ type: "stock/fetchEnterprise" });
              }}
              loading={isLoading}
            >
              {isLoading || "年"}
            </Button>
            <Button
              shape="circle"
              type="primary"
              onClick={() => {
                dispatch({ type: "stock/fetchCurrent" });
              }}
              loading={isLoading}
            >
              {isLoading || "现"}
            </Button>
          </>}
      </FixedPanel>
    </Wrap>
  );
};
