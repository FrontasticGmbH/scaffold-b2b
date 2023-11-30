import React, { useState } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import useResizeObserver from '@/hooks/useResizeObserver';
import { useAccordion } from '../../context';
import { Props } from './types';

const AccordionPanel = ({ children, className, defaultSpacing = true }: React.PropsWithChildren<Props>) => {
  const { isExpanded, isStable } = useAccordion();

  const { ref } = useResizeObserver<HTMLDivElement>((el) => setHeight(`${el.clientHeight}px`));

  const [height, setHeight] = useState('100%');

  const panelClassName = classnames('transition-[height] duration-150 ease-[cubic-bezier(0.25,0.1,0.25,0.1)]', {
    visible: isExpanded,
    'overflow-y-hidden': !isStable,
  });

  return (
    <div className={panelClassName} style={{ height: isExpanded ? height : 0 }}>
      <div ref={ref} className={classnames(className, { 'px-4 pb-6 pt-[6px]': defaultSpacing })}>
        {children}
      </div>
    </div>
  );
};

export default AccordionPanel;
