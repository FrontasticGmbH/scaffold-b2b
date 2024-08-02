import { DropdownProps } from '../types';

type CommonDropdownProps = Pick<DropdownProps, 'size' | 'disabled' | 'value' | 'className' | 'defaultValue'>;

export interface DropdownContextShape extends CommonDropdownProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onToggle: () => void;
  handleChange: (value: string[]) => void;
}

export interface Props {
  value: CommonDropdownProps & Pick<DropdownProps, 'onChange'>;
}
