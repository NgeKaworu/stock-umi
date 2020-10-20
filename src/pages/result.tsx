import React, { ReactElement, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import styled from "styled-components";

import { Button, Collapse, Descriptions, Input, message } from "antd";

import {
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  ToTopOutlined,
} from "@ant-design/icons";

import { CurrentInfo, Stock } from "@/models/stock";
import { SafeNumber } from "@/utils/Number";
import copy from "@/js-sdk/web/third-party/copy";
import Throttle from "@/js-sdk/native/throttle";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  
`;

const Title = styled.div`
  margin: 24px 0 0px;
  padding: 0 16px;
  line-height: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 24px;
  font-weight: 500;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const SketchItem = styled.div`
    display: flex;

    .serial {
        font-size: 24px;
        font-weight: 500;
        margin-right: 8px;
        line-height: 48px;
    };

    .main {
        flex: 1;
    };

    .info,
    .sub {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
    };

    .info > * {
        flex: 1;
        :last-child {
            text-align: end;
            white-space: nowrap;
        };
    };

    .info {
        font-weight: 500;
        border-bottom: 1px solid #eee;
    };

    .sub {
        font-weight: 300;
    };
`;

const FixedPanel = styled.div`
  position: fixed;
  bottom: 8vh;
  right: 8vw;
`;

function Result() {
  const { state } = useLocation();
  const history = useHistory();

  const ref = useRef(null);
  const [keyword, setKeyword] = useState("");

  if (!state) {
    history.replace("/");
  }

  return <Wrap>
    <Title>
      <ArrowLeftOutlined
        style={{ marginRight: "8px" }}
        onClick={history.goBack}
      />

      计算结果
    </Title>
    <Content ref={ref}>
      <Collapse bordered={false}>
        {(state as Stock[]).reduce((acc: ReactElement[], cur, idx) => {
          const {
            AAGR,
            CurrentInfo: ci,
            DCE,
            DCER,
            DPE,
            DPER,
            Grade,
            PB,
            PE,
            PEG,
            ROE,
          } = cur;
          const {
            name,
            code,
            classify,
            todayOpeningPrice,
            currentPrice,
            buy1Num,
            buy1Price,
            buy2Num,
            buy2Price,
            buy3Num,
            buy3Price,
            buy4Num,
            buy4Price,
            buy5Num,
            buy5Price,
            sell1Num,
            sell1Price,
            sell2Num,
            sell2Price,
            sell3Num,
            sell3Price,
            sell4Num,
            sell4Price,
            sell5Num,
            sell5Price,
            date,
          } = ci as CurrentInfo;

          function getColor() {
            if (SafeNumber(currentPrice) - SafeNumber(todayOpeningPrice) > 0) {
              return <div style={{ color: "#f5222d" }}>
                {currentPrice}
                <CaretUpOutlined />
              </div>;
            }
            if (SafeNumber(currentPrice) - SafeNumber(todayOpeningPrice) < 0) {
              return <div style={{ color: "#a0d911" }}>
                {currentPrice}
                <CaretDownOutlined />
              </div>;
            }

            return currentPrice;
          }

          function fuzzy() {
            return name?.includes(keyword) ||
              code?.includes(keyword) ||
              classify?.includes(keyword);
          }

          return fuzzy()
            ? acc.concat(
              <Collapse.Panel
                header={<SketchItem>
                  <div className="serial">
                    {idx + 1}.
                  </div>
                  <div className="main">
                    <div className="info">
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
                          copy(code, () => {
                            message.success("复制成功");
                          });
                        }}
                      >
                        {code}
                      </a>
                      <span>
                        {name}
                      </span>
                      <span>
                        {classify}
                      </span>
                    </div>
                    <div className="sub">
                      <span>
                        {getColor()}
                      </span>
                      <span>
                        {date}
                      </span>
                    </div>
                  </div>
                </SketchItem>}
                key={code}
              >
                <Descriptions
                  title={null}
                  size="small"
                  column={{ xs: 2, sm: 3, md: 4 }}
                  bordered
                >
                  <Descriptions.Item label="评分">
                    {Grade?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="市净率（PB）">
                    {PB?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="市盈率（PE）">
                    {PE?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="平均年增长率">
                    {AAGR?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="市盈增长比（PEG）">
                    {PEG?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="现金估值(动)">
                    {DCE?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="现金估值比(动)">
                    {DCER?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="利润估值(动)">
                    {DPE?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="利润估值比(动)">
                    {DPER?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="净资产收益率（ROE）">
                    {ROE?.toFixed(5)}
                  </Descriptions.Item>
                  <Descriptions.Item label="五手价格">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: 16 }}></th>
                          <th>买(￥)</th>
                          <th>数量</th>
                          <th>卖(￥)</th>
                          <th>数量</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>{buy1Price}</td>
                          <td>{buy1Num}</td>
                          <td>{sell1Price}</td>
                          <td>{sell1Num}</td>
                        </tr>

                        <tr>
                          <td>2</td>
                          <td>{buy2Price}</td>
                          <td>{buy2Num}</td>
                          <td>{sell2Price}</td>
                          <td>{sell2Num}</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>{buy3Price}</td>
                          <td>{buy3Num}</td>
                          <td>{sell3Price}</td>
                          <td>{sell3Num}</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>{buy4Price}</td>
                          <td>{buy4Num}</td>
                          <td>{sell4Price}</td>
                          <td>{sell4Num}</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>{buy5Price}</td>
                          <td>{buy5Num}</td>
                          <td>{sell5Price}</td>
                          <td>{sell5Num}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Descriptions.Item>
                </Descriptions>
              </Collapse.Panel>,
            )
            : acc;
        }, [])}
      </Collapse>
    </Content>

    <Input
      size="large"
      placeholder="输入代码、名称、板块过滤结果"
      onChange={Throttle((e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.currentTarget.value);
      }, 50)}
      value={keyword}
    >
    </Input>
    <FixedPanel>
      <Button
        shape="circle"
        type="primary"
        icon={<ToTopOutlined />}
        onClick={() => {
          (ref.current as unknown as Element).scrollTo(0, 0);
        }}
      >
      </Button>
    </FixedPanel>
  </Wrap>;
}

export default Result;
