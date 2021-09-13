import React, { useRef, useEffect } from 'react';
import { Button, DatePicker, Form, Input } from 'antd';
import SearchForm from '@/components/SearchForm';
import { RESTful } from '@/http';
import { mainHost } from '@/http/host';
import { compose } from '@/decorators/utils';
import { IOC } from '@/decorators/hoc';
import Format from '@/decorators/Format';
import moment from 'moment';

const { Item } = Form;
const { RangePicker } = DatePicker;
export default () => {
  const worker = new Worker('/stock/worker.js');
  useEffect(() => {
    worker.onmessage = (...args) => console.log('args', ...args);
    return () => {
      worker.terminate();
    };
  }, [worker]);

  async function onFinish(value: any) {
    const res = await RESTful.get(
      `${mainHost()}/stock-list?dataTime=${JSON.stringify(value?.dataTime)}`,
      { timeout: 0 },
    );
    console.log('res', res);
  }

  return (
    <>
      <SearchForm formProps={{ onFinish, layout: 'inline' }}>
        <Item label="时间" name="dataTime">
          {/* {compose<any>(
            IOC([
              Format({
                f: (val: any) => {
                  console.log('f', val);
                  return val?.map((v: any) => v?.toISOString());
                },
                g: (val: any) => {
                  console.log('g', val);
                  return val?.map((v) => moment(v));
                },
              }),
            ]),
          )()} */}
          <RangePicker />
        </Item>
        <Item>
          <Button htmlType="submit">提交</Button>
        </Item>
      </SearchForm>
      index
      <Input
        onChange={(e) => {
          worker?.postMessage(e.currentTarget.value);
        }}
      />
    </>
  );
};
