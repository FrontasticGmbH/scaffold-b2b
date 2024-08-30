import React, { useId } from 'react';
import { InformationCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import { classnames } from '@/utils/classnames/classnames';
import { InfoTooltipProps } from './types';

const InfoTooltip = ({
  children,
  content,
  icon,
  place = 'right',
  style = {},
  iconWidth = 20,
  iconHeight = 20,
  className = '',
  ...props
}: React.PropsWithChildren<InfoTooltipProps>) => {
  const id = useId();

  const Icon = icon ?? InfoIcon;

  return (
    <div className={classnames('flex items-center gap-2', className)}>
      {children}
      <Icon
        width={iconWidth}
        height={iconHeight}
        data-testid="tooltip-icon"
        data-tooltip-id={id}
        data-tooltip-content={content}
      />
      <Tooltip id={id} place={place} style={{ zIndex: 10, maxWidth: 230, ...style }} {...props} />
    </div>
  );
};

export default InfoTooltip;
