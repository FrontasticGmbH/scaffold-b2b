import { Option } from '../../types';

export interface Props {
  className?: string;
  children?: React.ReactNode | ((params: { selected: Array<Partial<Option>>; isExpanded: boolean }) => React.ReactNode);
}
