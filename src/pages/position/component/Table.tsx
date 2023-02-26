/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:34:30
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-26 18:33:42
 * @FilePath: /stock/stock-umi/src/pages/position/component/Table.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Table, { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import useLightTablePro from '@/js-sdk/components/LightTablePro/hook/useLightTablePro';
import Position from '@/model/position';
import { list } from '@/api/position';
import Editor from './Editor';
import ExchangeEditor from '../../exchange/component/Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { Space, Typography, Switch, Button, Modal } from 'antd';
import StockLabel from '@/pages/stock/component/StockLabel';
import { useHistory } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import create from '@ant-design/icons/lib/components/IconFont';
const { Link } = Typography;

export default () => {
  const history = useHistory();
  const { actionRef, formRef } = useLightTablePro();
  const editor = useModalForm();
  const exchangeEditor = useModalForm();

  const columns: LightTableProColumnProps<Position>[] = [
    {
      dataIndex: 'stock',
      title: '股票',
      hideInSearch: true,
      width: 180,
      render(value) {
        return <StockLabel stock={value} />;
      },
    },
    { dataIndex: ['stock', 'classify'], title: '板块', hideInSearch: true },
    {
      dataIndex: 'omitempty',
      title: '省略空仓',
      hideInTable: true,
      formItemProps: {
        valuePropName: 'checked',
      },
      renderFormItem() {
        return <Switch />;
      },
    },

    { dataIndex: 'yieldRate', title: '收益率', hideInSearch: true },
    { dataIndex: 'totalYield', title: '总收益', hideInSearch: true },
    { dataIndex: ['stock', 'currentPrice'], title: '现价', hideInSearch: true },
    { dataIndex: 'totalCapital', title: '总投入', hideInSearch: true },
    { dataIndex: 'totalDividend', title: '总派息', hideInSearch: true },
    { dataIndex: 'stopProfit', title: '止盈点', hideInSearch: true },
    { dataIndex: 'stopLoss', title: '止损点', hideInSearch: true },
    {
      dataIndex: 'code',
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (code, row) => (
        <Space>
          <Link onClick={createExchange(code)}>新增交易</Link>
          <Link onClick={viewCodeHistory(code)}>交易历史</Link>
          <Link onClick={edit(row)}>编辑</Link>
        </Space>
      ),
    },
  ];

  function edit(row: Position) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      editor.form.setFieldsValue(row);
    };
  }

  function editSuccess() {
    actionRef.current?.reload?.();
  }

  function viewCodeHistory(code: string) {
    return () => history.push(`/exchange/${code}`);
  }

  function createExchange(code?: string) {
    return () => {
      exchangeEditor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
      exchangeEditor.form.setFieldsValue({ code });

      exchangeEditor.setData({ code });
    };
  }

  function createExchangeSuccess(code: string) {
    actionRef.current?.reload?.();
    Modal.confirm({
      title: '提示',
      content: '是否跳转详情页',
      onOk: viewCodeHistory(code),
    });
  }

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />
      <ExchangeEditor {...exchangeEditor} onSuccess={createExchangeSuccess} />

      <Table
        rowKey={'code'}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        formProps={{
          initialValues: { omitempty: true },
        }}
        headerTitle={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={createExchange()}>
              新增
            </Button>
          </Space>
        }
        scroll={{
          x: 'max-content',
          y: '100%',
        }}
        queryOptions={{ refetchOnWindowFocus: false }}
        request={async (params, pagination) => {
          const res = await list({
            params: {
              ...params,
              skip: (pagination?.current ?? 0) * (pagination?.pageSize ?? 0),
              limit: pagination?.pageSize,
            },
          });

          return {
            data: res?.data || [],
            page: pagination?.current || 1,
            success: true,
            total: res?.total || 0,
          };
        }}
      />
    </>
  );
};
