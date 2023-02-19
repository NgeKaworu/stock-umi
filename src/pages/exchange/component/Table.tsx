/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-02-04 16:34:30
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-05 14:54:03
 * @FilePath: /stock/stock-umi/src/pages/position/detail/component/Table.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Table, { LightTableProColumnProps } from '@/js-sdk/components/LightTablePro';
import useLightTablePro from '@/js-sdk/components/LightTablePro/hook/useLightTablePro';
import Position from '@/model/position';
import { list, deleteOne } from '@/api/position';
import Editor from './Editor';
import PositionEditor from '../../position/component/Editor';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { Button, Space, Typography, Popconfirm, Switch, Card, Form, Descriptions } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { cloneElement } from 'react';
import { Stock } from '@/model';
import LightTable, { LightColumnProps } from '@/js-sdk/components/LightTable';

const { Link } = Typography;
const { Item } = Form;
const DescriptionsItem = Descriptions.Item;

export default () => {
  const { actionRef, formRef } = useLightTablePro();
  const editor = useModalForm();
  const positionEditor = useModalForm();

  const sorterHOF: (field: keyof Stock) => LightColumnProps<Stock>['sorter'] = (field) => (a, b) =>
    Number(a[field]) - Number(b[field]);

  const columns: LightTableProColumnProps<Position & { stock?: Stock; keyword?: string }>[] = [
    { dataIndex: 'createAt', title: '交易时间', valueType: 'dateTime' },
    { dataIndex: 'transactionPrice', title: '成交价' },
    { dataIndex: 'currentShare', title: '交易股份' },
    { dataIndex: 'currentCapital', title: '本次投入' },
    { dataIndex: 'currentDividend', title: '本次派息' },
    { dataIndex: 'comparative', title: '环比增长' },
    {
      dataIndex: 'id',
      title: '操作',
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

  function positionEditSuccess() {
    actionRef.current?.reload?.();
  }

  function editPosition(row: Position) {
    return () => {
      positionEditor.setModalProps((pre) => ({ ...pre, visible: true, title: '编辑' }));
      positionEditor.form.setFieldsValue(row);
    };
  }

  return (
    <>
      <Editor {...editor} onSuccess={editSuccess} />
      <PositionEditor {...positionEditor} onSuccess={positionEditSuccess} />

      <Card size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Descriptions
            title="股票名称"
            bordered
            extra={<Link onClick={editPosition({})}>编辑</Link>}
          >
            <DescriptionsItem label="收益率"> 收益率 </DescriptionsItem>
            <DescriptionsItem label="总收益"> 总收益</DescriptionsItem>
            <DescriptionsItem label="现价"> 现价</DescriptionsItem>
            <DescriptionsItem label="现值"> 现值</DescriptionsItem>
            <DescriptionsItem label="总股本"> 总股本</DescriptionsItem>
            <DescriptionsItem label="总股权"> 总股权</DescriptionsItem>
            <DescriptionsItem label="总派息"> 总派息</DescriptionsItem>
            <DescriptionsItem label="止盈点"> 止盈点</DescriptionsItem>
            <DescriptionsItem label="止损点"> 止损点</DescriptionsItem>
          </Descriptions>
          <Space>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={create}>
              新增
            </Button>
          </Space>
          <LightTable
            columnEmptyText="-"
            columns={columns}
            scroll={{ x: 'max-content' }}
            rowKey={(r) => `${r.bourse}${r.code}`}
            dataSource={[]}
          />
        </Space>
      </Card>
    </>
  );
};
