import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tooltip,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SearchForm from '@/components/SearchForm';
import { RESTful } from '@/http';
import { mainHost } from '@/http/host';
import workerURL from './innerWorker';
import isValidValue from '@/utils/isValidValue';
import { DnDForm, DnDFormProps } from '@/components/DnDForm';
import Search from '@/decorators/Select/Search';
import { compose } from '@/decorators/utils';
import Options from '@/utils/Options';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import shouldUpdateHOF from '@/decorators/shouldUpdateHOF';
import { Stock } from './modal';

const { Item, ErrorList } = Form;
const { RangePicker } = DatePicker;

export default () => {
  const worker = new Worker(workerURL);
  const [dataSource, setDataSource] = useState<Stock[]>();
  useEffect(() => {
    worker.onmessage = (...args) => console.log('args', ...args);
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

  const columns: DnDFormProps['columns'] = [
    {
      title: '权重系数',
      render: ({ field }) => (
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
      render: ({ field }) => (
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
                {compose(Search)(
                  <Select
                    allowClear
                    options={Options(fields).toOpt?.map((opt: any) => ({
                      ...opt,
                      label: (
                        <>
                          {`${opt.value} - ${opt.label}`}{' '}
                          {tooltipMap.get(opt.value)}
                        </>
                      ),
                      disabled: usedInOther?.includes(opt?.value),
                    }))}
                  />,
                )}
              </Item>
            );
          }}
        </Item>
      ),
    },
    {
      title: '是否生序',
      render: ({ field }) => (
        <Item
          {...field}
          wrapperCol={{ style: { alignItems: 'center' } }}
          name={[field.name, 'isAsc']}
        >
          <Switch />
        </Item>
      ),
    },
    {
      title: '操作',
      render: ({ field, operation }) => (
        <Item {...field} wrapperCol={{ style: { alignItems: 'center' } }}>
          <Button
            danger
            type="link"
            onClick={() => operation.remove(field.name)}
          >
            删除
          </Button>
        </Item>
      ),
    },
  ];

  async function onFinish(value: any) {
    try {
      const { dataTime } = value,
        res = await RESTful.get(
          `${mainHost()}/stock-list?dataTime=${JSON.stringify(dataTime)}`,
          { timeout: 0 },
        );
      setDataSource(res?.data);
    } catch {}
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
          <Button htmlType="submit">提交</Button>
        </Item>
      </SearchForm>

      <Form>
        <DndProvider backend={HTML5Backend}>
          <DnDForm
            name="weights"
            columns={columns}
            formListProps={{
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
            {({ title, body, meta, operation }) => (
              <>
                <ErrorList errors={meta.errors} />
                {title}
                {body}
                <Button
                  type="link"
                  onClick={() => operation.add({ isAsc: true, coefficient: 1 })}
                >
                  {' '}
                  + 添加字段
                </Button>
              </>
            )}
          </DnDForm>
        </DndProvider>
        <Item>
          <Button htmlType="submit" disabled={!isValidValue(dataSource)}>
            计算
          </Button>
        </Item>
      </Form>
    </>
  );
};
