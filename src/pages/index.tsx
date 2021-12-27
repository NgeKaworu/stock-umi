import { ReactNode, useEffect, useState } from 'react';
import { Button, DatePicker, Form, InputNumber, Switch, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Stock } from './modal';
import EdiTable, { EdiTableColumnType } from '@/js-sdk/components/EdiTable';
import SearchForm from '@/js-sdk/components/SearchForm';
import shouldUpdateHOF from '@/js-sdk/decorators/shouldUpdateHOF';
import isValidValue from '@/js-sdk/utils/isValidValue';
import Options from '@/js-sdk/utils/Options';
import SearchSelect from '@/js-sdk/components/SearchSelect';
import { restful } from '@/js-sdk/utils/http';

const { Item, ErrorList } = Form;
const { RangePicker } = DatePicker;

export default () => {
  const worker = new Worker('/worker.js');
  const [dataSource, setDataSource] = useState<Stock[]>();
  const workerHandler: Worker['onmessage'] = (...args) => {
    console.log('onmessage', args);
  };
  const [calculating, setCalculating] = useState<boolean>();
  useEffect(() => {
    worker.onmessage = workerHandler;
    return () => worker.terminate();
  }, [worker]);

  const tooltipMap = new Map<string, ReactNode>([
    [
      'PB',
      <Tooltip title="市值 / 净资产 （反映市场预期）">
        <InfoCircleOutlined />
      </Tooltip>,
    ],
    [
      'PE',
      <Tooltip title="市值 / 净利润 （反映回本时间）">
        <InfoCircleOutlined />
      </Tooltip>,
    ],
    [
      'PEG',
      <Tooltip title="PE / 平均年增长率">
        <InfoCircleOutlined />
      </Tooltip>,
    ],
    [
      'ROE',
      <Tooltip title="净利润 / 净资产 (盈利能力)">
        <InfoCircleOutlined />
      </Tooltip>,
    ],
  ]);

  const fields = new Map<string, ReactNode>([
    ['PB', '市净率'],
    ['PE', '市盈率'],
    ['PEG', '市盈增长比'],
    ['ROE', '净资产收益率'],
    ['DPE', '利润估值'],
    ['DPER', '动态利润估值率'],
    ['DCE', '动态现金估值'],
    ['DCER', '动态现金估值率'],
    ['AAGR', '平均年增长率'],
  ]);

  const columns: EdiTableColumnType<Stock>[] = [
    {
      title: '权重系数',
      renderFormItem: ({ field }) => (
        <Item
          {...field}
          wrapperCol={{ style: { alignItems: 'center' } }}
          name={[field.name, 'coefficient']}
        >
          <InputNumber step={0.1} />
        </Item>
      ),
    },
    {
      title: '字段',
      renderFormItem: ({ field }) => (
        <Item noStyle shouldUpdate={shouldUpdateHOF(['weights'])}>
          {({ getFieldValue }) => {
            const weights = getFieldValue('weights'),
              usedInOther = weights?.reduce(
                (acc: any[], weight: any, idx: number) =>
                  idx !== field.name ? acc?.concat(weight?.field) : acc,
                [],
              );

            return (
              <Item
                {...field}
                wrapperCol={{ span: 24, style: { alignItems: 'center' } }}
                name={[field.name, 'field']}
                rules={[{ required: true }]}
              >
                <SearchSelect
                  allowClear
                  options={Options(fields).toOpt?.map((opt: any) => ({
                    ...opt,
                    label: (
                      <>
                        {`${opt.value} - ${opt.label}`} {tooltipMap.get(opt.value)}
                      </>
                    ),
                    disabled: usedInOther?.includes(opt?.value),
                  }))}
                />
              </Item>
            );
          }}
        </Item>
      ),
    },
    {
      title: '是否生序',
      renderFormItem: ({ field }) => (
        <Item
          {...field}
          wrapperCol={{ style: { alignItems: 'center' } }}
          name={[field.name, 'isAsc']}
          valuePropName="checked"
        >
          <Switch />
        </Item>
      ),
    },
    {
      title: '操作',
      renderFormItem: ({ field, operation }) => (
        <Item {...field} wrapperCol={{ style: { alignItems: 'center' } }}>
          <Button danger type="link" onClick={() => operation.remove(field.name)}>
            删除
          </Button>
        </Item>
      ),
    },
  ];

  async function onFinish(value: any) {
    try {
      const { dataTime } = value,
        res = await restful.get(`stock/stock-list?dataTime=${JSON.stringify(dataTime)}`, {
          timeout: 0,
        });
      setDataSource(res?.data);
    } catch {}
  }

  async function calc(value: any) {
    worker.postMessage({ type: 'calc', payload: { dataSource, ...value } });
    setCalculating(true);
  }

  return (
    <>
      <SearchForm
        formProps={{
          onFinish,
          labelCol: { span: 7 },
          wrapperCol: { span: 14, style: { alignItems: 'center' } },
        }}
      >
        <Item label="时间" name="dataTime" rules={[{ required: true }]}>
          <RangePicker />
        </Item>
        <Item>
          <Button htmlType="submit">查询</Button>
        </Item>
      </SearchForm>

      <Form onFinish={calc}>
        <DndProvider backend={HTML5Backend}>
          <EdiTable
            tableProps={{ columns }}
            formListProps={{
              name: 'weights',
              rules: [
                {
                  validator(_, value) {
                    if (isValidValue(value)) return Promise.resolve();
                    return Promise.reject(new Error('至少一条'));
                  },
                },
              ],
            }}
          >
            {({ body, meta, operation }) => (
              <>
                <ErrorList errors={meta.errors} />

                {body}
                <Button type="link" onClick={() => operation.add({ isAsc: true, coefficient: 1 })}>
                  {' '}
                  + 添加字段
                </Button>
              </>
            )}
          </EdiTable>
        </DndProvider>
        <Item>
          <Button htmlType="submit" disabled={!isValidValue(dataSource)} loading={calculating}>
            计算
          </Button>
        </Item>
      </Form>
    </>
  );
};
