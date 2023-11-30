import { useCallback, useState } from 'react';
import { Options } from './types';

const useDisclosure = ({ openDelay, closeDelay, defaultIsOpen = false }: Options = {}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => {
    if (openDelay) setTimeout(() => setIsOpen(true), openDelay);
    else setIsOpen(true);
  }, [openDelay]);

  const onClose = useCallback(() => {
    if (closeDelay) setTimeout(() => setIsOpen(false), closeDelay);
    else setIsOpen(false);
  }, [closeDelay]);

  const onToggle = useCallback(() => {
    if (isOpen) onClose();
    else onOpen();
  }, [onOpen, onClose, isOpen]);

  return { isOpen, onOpen, onClose, onToggle };
};

export default useDisclosure;
