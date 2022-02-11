import DrawerForm from '@/js-sdk/components/DrawerForm';
import useDrawerForm from '@/js-sdk/components/DrawerForm/useDrawerForm';
import { WithSuccess } from '@/js-sdk/Interface/Container';

import { ReactNode } from 'react';
import { Button, Form, InputNumber, Switch, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { Weight } from '../../model';
import EdiTable, { EdiTableColumnType } from '@/js-sdk/components/EdiTable';
import shouldUpdateHOF from '@/js-sdk/decorators/shouldUpdateHOF';
import isValidValue from '@/js-sdk/utils/isValidValue';
import Options from '@/js-sdk/utils/Options';
import SearchSelect from '@/js-sdk/components/SearchSelect';
import ConditionEditor from './ConditionEditor';
import { renderCondition } from './ConditionEditor/util';

const { Item, ErrorList } = Form;
const { Link } = Typography;

export const tooltipMap = new Map<string, ReactNode>([
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

export const fields = new Map<string, ReactNode>([
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

const columns: EdiTableColumnType<Weight>[] = [
  {
    title: '权重系数',
    width: 120,
    renderFormItem: ({ field }) => (
      <Item {...field} name={[field.name, 'coefficient']}>
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
              name={[field.name, 'field']}
              rules={[{ required: true, message: '计算字段不能为空' }]}
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
    width: 120,
    title: '是否生序',
    renderFormItem: ({ field }) => (
      <Item {...field} name={[field.name, 'isAsc']} valuePropName="checked">
        <Switch />
      </Item>
    ),
  },
  {
    width: 200,
    title: '过滤条件',
    renderFormItem: ({ field }) => (
      <Item
        dependencies={[['weights', field.name, 'filter']]}
        noStyle
        fieldKey={field.fieldKey}
        key={field.key}
      >
        {({ getFieldValue }) => (
          <Item {...field} name={[field.name, 'filter']}>
            <ConditionEditor>
              <div>
                {renderCondition(getFieldValue(['weights', field.name, 'filter']))}{' '}
                <Link>编辑条件</Link>
              </div>
            </ConditionEditor>
          </Item>
        )}
      </Item>
    ),
  },
  {
    width: 120,
    title: '操作',
    renderFormItem: ({ field, operation }) => (
      <Item {...field}>
        <Link type="danger" onClick={() => operation.remove(field.name)}>
          删除
        </Link>
      </Item>
    ),
  },
];

export const encodeWeight = (s: Weight[]) => JSON.stringify(s);

export const decodeWeight = (j: string | null): Weight[] => {
  try {
    return JSON.parse(j ?? '');
  } catch {
    return [];
  }
};

export default ({
  onSuccess,
  formProps,
  drawerProps,
  setDrawerProps,
}: WithSuccess<ReturnType<typeof useDrawerForm>>) => {
  async function onFinish() {
    const { weights } = await formProps?.form?.validateFields();
    await onSuccess(weights);
    localStorage.setItem('Weight', encodeWeight(weights));
    setDrawerProps((pre) => ({ ...pre, visible: false }));
  }
  function onClose() {
    setDrawerProps((pre) => ({ ...pre, visible: false }));
  }

  return (
    <DrawerForm
      formProps={{
        ...formProps,
        initialValues: { weights: decodeWeight(localStorage.getItem('Weight')) },
        onFinish,
      }}
      drawerProps={{ ...drawerProps, onOk: onFinish, onClose: onClose, title: '计算指标' }}
    >
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
    </DrawerForm>
  );
};
