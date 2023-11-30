import React, { FC, PropsWithChildren } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import AccordionButton from './components/accordion-button';
import AccordionProvider from './context';
import AccordionPanel from './components/accordion-panel';
import { AccordionProps } from './types';

const Accordion: FC<PropsWithChildren<AccordionProps>> & {
  Button: typeof AccordionButton;
  Panel: typeof AccordionPanel;
} = ({ children, isExpanded, onExpand, onCollapse, defaultIsExpanded = false, className = '' }) => {
  return (
    <AccordionProvider
      defaultIsExpanded={defaultIsExpanded}
      isExpanded={isExpanded}
      onExpand={onExpand}
      onCollapse={onCollapse}
    >
      <div className={classnames('rounded-md border border-neutral-400', className)}>{children}</div>
    </AccordionProvider>
  );
};

Accordion.Button = AccordionButton;
Accordion.Panel = AccordionPanel;

export default Accordion;
