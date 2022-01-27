import { useState } from 'react';
import { Button, DatePicker, Form, Space } from 'antd';
import SearchForm from '@/js-sdk/components/SearchForm';
import { restful } from '@/js-sdk/utils/http';
import { WithSuccess } from '@/js-sdk/Interface/Container';

const { Item } = Form;
const { RangePicker } = DatePicker;

export default ({ onSuccess }: WithSuccess<{}>) => {
  const [loading, setLoading] = useState(false);
  async function onFinish(value: any) {
    setLoading(true);
    try {
      const { dataTime } = value,
        res = await restful.get(`stock/stock-list?dataTime=${JSON.stringify(dataTime)}`, {
          timeout: 0,
        });
      onSuccess(res?.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <SearchForm formProps={{ onFinish, wrapperCol: void 0, labelCol: void 0 }}>
      <Space>
        <Item name="dataTime" rules={[{ required: true, message: '时间区间不能为空' }]}>
          <RangePicker />
        </Item>
        <Item>
          <Button htmlType="submit" type="primary" ghost loading={loading}>
            选择时间区间
          </Button>
        </Item>
      </Space>
    </SearchForm>
  );
};
