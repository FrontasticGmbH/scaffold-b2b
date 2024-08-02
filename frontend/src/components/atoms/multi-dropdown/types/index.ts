export interface Option {
  value: string;
}

export interface DropdownProps {
  size?: 'sm' | 'lg';
  disabled?: boolean;
  className?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}
