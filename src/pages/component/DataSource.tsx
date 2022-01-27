import { useState } from 'react';
import { Button, DatePicker, Divider, Form, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
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

  async function crawl() {
    setLoading(true);
    try {
      await restful.get(`stock/stockCrawlMany`, {
        timeout: 0,
      });
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
        <Divider />
        <Item>
          <Button
            danger
            onClick={crawl}
            shape="round"
            ghost
            loading={loading}
            icon={<SyncOutlined />}
          >
            重爬今日
          </Button>
        </Item>
      </Space>
    </SearchForm>
  );
};
