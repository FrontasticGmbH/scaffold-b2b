import React from 'react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';
import { useAccordion } from '../../context';
import { Props } from './types';

const AccordionButton = ({ children, className = '', defaultSpacing = true }: React.PropsWithChildren<Props>) => {
  const { isExpanded, toggle } = useAccordion();

  const arrowClassName = classnames('text-gray-700', isExpanded ? 'rotate-180' : '');

  return (
    <div
      className={classnames(
        'flex cursor-pointer items-center justify-between',
        { 'px-4 py-[18px]': defaultSpacing },
        className,
      )}
      onClick={toggle}
    >
      <div>{children}</div>
      <ArrowIcon width={24} className={arrowClassName} />
    </div>
  );
};

export default AccordionButton;
