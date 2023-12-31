import * as React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { CellProps } from './types';
import { highlight } from '../../utils/highlight';
import { deviceVisibility } from '../../utils/device-visibility';

const Cell = ({ configuration, isHighlighted, children, className }: CellProps) => {
  const styles: React.CSSProperties = {
    gridColumn: `span ${configuration.size} / span ${configuration.size}`,
  };

  const classNames = classnames(className, highlight(isHighlighted), deviceVisibility(configuration));

  return (
    <div style={styles} className={classNames}>
      {children}
    </div>
  );
};

export default Cell;
