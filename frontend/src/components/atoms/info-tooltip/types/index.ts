import type { Tooltip } from 'react-tooltip';

export interface InfoTooltipProps extends React.ComponentProps<typeof Tooltip> {
  content?: string;
  icon?: React.ComponentType;
  iconWidth?: number;
  iconHeight?: number;
  className?: string;
}
