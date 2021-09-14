import React, { ReactElement, cloneElement } from 'react';
import { curry, maybe, compose } from './utils';

export interface ForwardProps {
  onChange?: (v: any) => any;
  [key: string]: any;
}

export const IOC = curry(
  (fns: Array<(pars: any) => any>, Element: ReactElement) => (
    <ChildrenRender<ForwardProps>>
      {(forwardProps) => {
        const ele = compose(...fns)(cloneElement(Element, forwardProps));
        return cloneElement(ele, {
          onChange: compose(
            maybe(forwardProps?.onChange),
            maybe(ele?.props?.onChange),
          ),
        });
      }}
    </ChildrenRender>
  ),
);

export function ChildrenRender<T extends unknown>({
  children,
  ...props
}: {
  children: (props: T) => ReactElement;
}) {
  return children?.(props as T);
}
