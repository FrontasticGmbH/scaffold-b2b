import React from 'react';
import { SpacerProps } from './types';

const Spacer = ({ bgColor = 'white', space }: SpacerProps) => {
  const bgColorToClassName = {
    white: 'bg-white',
    'neutral-200': 'bg-neutral-200',
  } as Record<typeof bgColor, string>;

  return <div data-testid="spacer" className={bgColorToClassName[bgColor]} style={{ paddingTop: space }} />;
};

export default Spacer;
