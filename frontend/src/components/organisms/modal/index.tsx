'use client';

import { useEffect } from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import ReactModal from 'react-modal';
import useScrollBlock from '@/hooks/useScrollBlock';
import { Props } from './types';
import useClassNames from './hooks/useClassNames';

const Modal = ({
  children,
  preventScroll,
  style,
  closeButton,
  className = '',
  size = 'lg',
  variant = 'default',
  centered = true,
  ...props
}: React.PropsWithChildren<Props>) => {
  const { blockScroll } = useScrollBlock();

  useEffect(() => {
    if (preventScroll) blockScroll(preventScroll);
  }, [blockScroll, preventScroll]);

  const { modalClassNames } = useClassNames({ className, size, centered, variant });

  const modalStyle: Props['style'] = {
    overlay: {
      zIndex: 51,
      backgroundColor: 'rgba(5, 16, 54, 0.2)',
      ...style?.overlay,
    },
    content: {
      padding: 0,
      ...style?.content,
    },
  };

  return (
    <ReactModal
      {...props}
      ariaHideApp={false}
      preventScroll={false}
      style={modalStyle}
      className={modalClassNames}
      parentSelector={() => document.getElementById('react-modal-custom-portal') ?? document.body}
    >
      {closeButton && (
        <CloseIcon
          className="absolute right-4 top-4 h-6 w-6 cursor-pointer text-gray-700"
          onClick={props.onRequestClose}
        />
      )}
      {children}
    </ReactModal>
  );
};

export default Modal;
