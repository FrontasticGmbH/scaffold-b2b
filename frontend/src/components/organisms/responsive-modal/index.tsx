import React from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { tablet } from '@/constants/screensizes';
import Modal from '../modal';
import { Props as ModalProps } from '../modal/types';

const ResponsiveModal = (props: ModalProps) => {
  const [isLargerThanTablet] = useMediaQuery(tablet);

  return <Modal {...props} variant={isLargerThanTablet ? 'default' : 'sticky-bottom'} size="fit" />;
};

export default ResponsiveModal;
