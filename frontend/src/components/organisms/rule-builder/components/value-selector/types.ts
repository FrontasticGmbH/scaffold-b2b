import { Criteria } from '../../types';

export interface Props {
  className?: string;
  criteria?: Criteria;
  value?: string;
  disabled?: boolean;
  onChange?: (val: string) => void;
}
