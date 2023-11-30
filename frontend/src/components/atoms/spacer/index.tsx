import React from 'react';
import { SpacerProps } from './types';

const Spacer = ({ bgColor, space }: SpacerProps) => {
  const bgColorToClassName = {
    white: 'bg-white',
    'neutral-200': 'bg-neutral-200',
  } as Record<typeof bgColor, string>;

  return <div className={bgColorToClassName[bgColor]} style={{ paddingTop: space }} />;
};

export default Spacer;
