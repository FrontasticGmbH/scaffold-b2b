import { DropdownProps, Option } from '../types';

type CommonDropdownProps = Pick<DropdownProps, 'size' | 'disabled' | 'value' | 'className' | 'defaultValue'>;

export interface DropdownContextShape extends CommonDropdownProps {
  handleChange: (value: Option) => void;
}

export interface Props {
  value: CommonDropdownProps & Pick<DropdownProps, 'onChange'>;
}
