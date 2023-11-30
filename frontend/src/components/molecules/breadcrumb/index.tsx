'use client';

import React, { useMemo } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { BreadcrumbProps } from './types';
import Truncator from './components/truncator';

const Breadcrumb = ({
  children,
  Separator = '/',
  className = '',
  disabled = false,
  maxItems = React.Children.count(children),
}: React.PropsWithChildren<BreadcrumbProps>) => {
  const itemsCount = React.Children.count(children);

  const { head, middle, tail } = useMemo(() => {
    const head = React.Children.toArray(children).slice(0, Math.ceil(maxItems / 2));
    const middle = React.Children.toArray(children).slice(
      Math.ceil(maxItems / 2),
      itemsCount - Math.floor(maxItems / 2),
    );
    const tail = React.Children.toArray(children).slice(itemsCount - Math.floor(maxItems / 2));

    return { head, middle, tail };
  }, [maxItems, children, itemsCount]);

  const breadcrumb = [
    ...head,
    ...(maxItems < itemsCount ? [<Truncator key={Date.now()}>{middle}</Truncator>] : []),
    ...tail,
  ];

  const listClassName = classnames('flex items-center justify-start gap-x-3 whitespace-pre', className);

  return (
    <ol className={classnames(className, listClassName)} role="list">
      {React.Children.map(breadcrumb, (Child, index) => {
        const isLastElement = index === breadcrumb.length - 1;

        const itemClassName = classnames('text-12 leading-tight transition', {
          'text-gray-300': disabled,
          'hover:font-medium hover:text-gray-700': !disabled,
          'text-gray-700': !disabled && isLastElement,
          'text-primary': !disabled && !isLastElement,
        });

        return (
          <li className="flex items-center gap-x-3">
            <div className={itemClassName}>{Child}</div>
            {!isLastElement && <span className="text-neutral-400">{Separator}</span>}
          </li>
        );
      })}
    </ol>
  );
};

export default Breadcrumb;
