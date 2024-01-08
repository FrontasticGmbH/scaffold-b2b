export interface Props {
  showLabel?: boolean;
  value?: number;
  defaultValue?: number;
  maxValue?: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
}
