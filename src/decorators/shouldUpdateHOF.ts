import getIn from '@/utils/getIn';
import { FormItemProps } from 'antd';

export default (name: FormItemProps['name']): FormItemProps['shouldUpdate'] => {
  const safePath = ([] as any).concat(name);
  return (p, n) => getIn(p, safePath) !== getIn(n, safePath);
};
