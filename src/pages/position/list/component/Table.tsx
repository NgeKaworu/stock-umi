/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:34:30
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-04 18:03:10
 * @FilePath: /stock/stock-umi/src/pages/position/list/component/Table.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Table, { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import useLightTablePro from '@/js-sdk/components/LightTablePro/hook/useLightTablePro';
import Position from '@/model/position';
import { list, deleteOne } from '@/api/position';
import Editor from './Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { Button, Space, Typography, Popconfirm, Switch, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { cloneElement } from 'react';
import { Stock } from '@/model';
import { LightColumnProps } from '@/js-sdk/components/LightTable';
const { Link } = Typography;
const { Item } = Form;

export default () => {
  const { actionRef, formRef } = useLightTablePro();
  const editor = useModalForm();

  const sorterHOF: (field: keyof Stock) => LightColumnProps<Stock>['sorter'] = (field) => (a, b) =>
    Number(a[field]) - Number(b[field]);

  const columns: LightTableProColumnProps<Position & { stock?: Stock; keyword?: string }>[] = [
    { dataIndex: 'keyword', title: '关键字', hideInTable: true },
    { dataIndex: ['stock', 'classify'], title: '板块' },
    {
      dataIndex: 'omitempty',
      title: '省略空仓',
      hideInTable: true,
      formItemProps: {
        valuePropName: 'checked',
      },
      renderFormItem(c, defaultRender, form) {
        return <Switch defaultChecked />;
      },
    },

    {
      dataIndex: 'id',
      title: '股票',
      hideInSearch: true,
      copyable: true,
    },
    { dataIndex: 'yieldRate', title: '收益率', hideInSearch: true },
    { dataIndex: 'totalYield', title: '总收益', hideInSearch: true },
    { dataIndex: ['stock', 'currentPrice'], title: '现价', hideInSearch: true },
    { dataIndex: 'totalCapital', title: '总投入', hideInSearch: true },
    { dataIndex: 'totalDividend', title: '总派息', hideInSearch: true },
    { dataIndex: 'stopProfit', title: '止盈点', hideInSearch: true },
    { dataIndex: 'stopLoss', title: '止损点', hideInSearch: true },
    { dataIndex: 'createAt', title: '创建时间', valueType: 'dateTime', hideInSearch: true },
    { dataIndex: 'updateAt', title: '更新时间', valueType: 'dateTime', hideInSearch: true },
    {
      dataIndex: 'id',
      title: '操作',
      hideInSearch: true,
      render: (id, row) => (
        <Space>
          <Link onClick={edit(row)}>编辑</Link>
          <Popconfirm title="操作不可逆，请二次确认" onConfirm={remove(id)}>
            <Link>删除</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function create() {
    editor.setModalProps((pre) => ({ ...pre, visible: true, title: '新增' }));
  }

  function edit(row: Position) {
    return () => {
      editor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      editor.form.setFieldsValue(row);
    };
  }

  function remove(id: Position['id']) {
    return async () => {
      try {
        await deleteOne(id, { notify: true });
        actionRef.current?.reload?.();
      } catch {}
    };
  }

  function editSuccess() {
    actionRef.current?.reload?.();
  }

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />
      <Table
        rowKey={'id'}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        formProps={{
          initialValues: { omitempty: true },
        }}
        headerTitle={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={create}>
              新增
            </Button>
          </Space>
        }
        queryOptions={{ refetchOnWindowFocus: false }}
        request={async (params, pagination) => {
          console.log('params', params);
          const res = await list({
            params: {
              keyword: params?.keyword,
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
