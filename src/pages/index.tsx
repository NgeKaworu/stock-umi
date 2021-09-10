import React, { useRef, useEffect } from 'react';
import { Button, DatePicker, Form, Input } from 'antd';
import SearchForm from '@/components/SearchForm';

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

  function onFinish(value: any) {
    console.log(JSON.stringify(value));
  }
  return (
    <>
      <SearchForm formProps={{ onFinish, layout: 'inline' }}>
        <Item label="时间" name="dataTime">
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
