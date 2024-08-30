'use client';

import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { OverlayProps } from '../overlay/types';

const Overlay = ({ onClick, zIndex, className = '' }: OverlayProps) => {
  const overlayClassNames = classnames(
    className,
    zIndex ?? 'z-[305]',
    'fixed left-0 top-0 h-screen w-screen bg-[#051036]/20',
  );
  return <div data-testid={'overlay'} className={overlayClassNames} onClick={onClick} />;
};

export default Overlay;
