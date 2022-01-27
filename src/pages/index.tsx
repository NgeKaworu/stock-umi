import { useEffect, useState } from 'react';
import { Button, Steps, Tag, Form } from 'antd';

import { Stock, Weight as IWeight } from '../model';
import isValidValue from '@/js-sdk/utils/isValidValue';
import Weight, { decodeWeight, fields, tooltipMap } from './component/Weight';
import useDrawerForm from '@/js-sdk/components/DrawerForm/useDrawerForm';
import DataSource from './component/DataSource';
import LightTable, { LightColumnProps } from '@/js-sdk/components/LightTable';

const worker = new Worker(new URL('../worker/stock.ts', import.meta.url));

const { Step } = Steps;
const { Item } = Form;

export default () => {
  const [dataSource, setDataSource] = useState<Stock[]>(),
    [data, setData] = useState<Stock[]>(),
    [weights, setWeights] = useState<IWeight[]>(decodeWeight(localStorage.getItem('Weight'))),
    [calculating, setCalculating] = useState<boolean>(),
    workerHandler: Worker['onmessage'] = (e) => {
      setData(e?.data?.payload);
      setCalculating(false);
    },
    weight = useDrawerForm();

  useEffect(() => {
    worker.onmessage = workerHandler;
    return () => worker.terminate();
  }, [worker]);

  async function calc() {
    worker.postMessage({ type: 'calc', payload: { dataSource, weights } });
    setCalculating(true);
  }

  const sorterHOF: (field: keyof Stock) => LightColumnProps<Stock>['sorter'] = (field) => (a, b) =>
    Number(a[field]) - Number(b[field]);

  const columns: LightColumnProps<Stock>[] = [
    {
      title: '股票',
      dataIndex: 'mixed',
      render: (_, r) => `${r.bourse}${r.code} ${r.name}`,
      width: 200,
    },
    {
      title: '板块',
      dataIndex: 'classify',
      width: 200,
      ellipsis: { tooltip: true, rows: 1, padding: 17 },
    },
    { title: '评分', dataIndex: 'grade', sorter: sorterHOF('grade') },

    { title: '市净率', dataIndex: 'PB', decimal: 2, sorter: sorterHOF('PB') },
    { title: '市盈率', dataIndex: 'PE', decimal: 2, sorter: sorterHOF('PE') },
    { title: '市盈增长比', dataIndex: 'PEG', decimal: 2, sorter: sorterHOF('PEG') },
    { title: '净资产收益率', dataIndex: 'ROE', decimal: 2, sorter: sorterHOF('ROE') },
    { title: '动态利润估值', dataIndex: 'DPE', decimal: 2, sorter: sorterHOF('DPE') },
    { title: '动态利润估值率', dataIndex: 'DPER', decimal: 2, sorter: sorterHOF('DPER') },
    { title: '动态现金估值', dataIndex: 'DCE', decimal: 2, sorter: sorterHOF('DCE') },
    { title: '动态现金估值率', dataIndex: 'DCER', decimal: 2, sorter: sorterHOF('DCER') },
    { title: '平均年增长率', dataIndex: 'AAGR', decimal: 2, sorter: sorterHOF('AAGR') },
  ];

  return (
    <>
      <Weight {...weight} onSuccess={setWeights} />

      <Steps direction="vertical">
        <Step
          status={isValidValue(dataSource) ? 'finish' : 'wait'}
          title="先选个时间范围"
          description={<DataSource onSuccess={setDataSource} />}
        />
        <Step
          status={isValidValue(weights) ? 'finish' : 'wait'}
          title="设置一些计算指标"
          description={
            <Item>
              {weights?.map?.((w) => (
                <Tag color={w.isAsc ? 'lawngreen' : 'orangered'} key={w.field}>
                  {tooltipMap.get(w.field)} {w.field} {fields.get(w.field)} ({w.coefficient})
                </Tag>
              ))}
              <Button
                onClick={() => weight.setDrawerProps((pre) => ({ ...pre, visible: true }))}
                type="primary"
                ghost
              >
                配置计算指标
              </Button>
            </Item>
          }
        />
        <Step
          title="web work 异步运算"
          description={
            <Item>
              <Button
                onClick={calc}
                type="primary"
                disabled={!isValidValue(dataSource) || !isValidValue(weights)}
                loading={calculating}
              >
                计算
              </Button>
            </Item>
          }
        />
      </Steps>

      <LightTable
        columnEmptyText="-"
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowKey={(r) => `${r.bourse}${r.code}`}
        dataSource={data}
      />
    </>
  );
};
