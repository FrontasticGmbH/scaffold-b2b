import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useDisclosure from '@/hooks/useDisclosure';
import { AccordionContextShape, AccordionProviderProps } from './types';

const AccordionContext = React.createContext({} as AccordionContextShape);

const AccordionProvider = ({
  children,
  isExpanded: isExpandedProp,
  onExpand,
  onCollapse,
  defaultIsExpanded = false,
}: React.PropsWithChildren<AccordionProviderProps>) => {
  const {
    isOpen: isExpandedState,
    onOpen: expand,
    onClose: collapse,
    onToggle: toggle,
  } = useDisclosure({ defaultIsOpen: defaultIsExpanded });

  const isExpanded = isExpandedProp ?? isExpandedState;

  const timeout = useRef<NodeJS.Timeout>(null) as React.MutableRefObject<NodeJS.Timeout>;

  const [isStable, setIsStable] = useState(isExpanded);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);

    if (isExpanded) timeout.current = setTimeout(() => setIsStable(true), 200);
    else setIsStable(false);
  }, [isExpanded]);

  const handleExpand = useCallback(() => {
    expand();
    onExpand?.();
  }, [expand, onExpand]);

  const handleCollapse = useCallback(() => {
    collapse();
    onCollapse?.();
  }, [collapse, onCollapse]);

  const handleToggle = useCallback(() => {
    toggle();
    (isExpanded ? onCollapse : onExpand)?.();
  }, [isExpandedProp, onCollapse, onExpand, toggle]);

  return (
    <AccordionContext.Provider
      value={{
        isExpanded,
        isStable,
        expand: handleExpand,
        collapse: handleCollapse,
        toggle: handleToggle,
      }}
    >
      {children}
    </AccordionContext.Provider>
  );
};

export default AccordionProvider;

export const useAccordion = () => useContext(AccordionContext);
