export type DrawerVariant = 'left' | 'right';

export interface DrawerTransitions {
  enterFrom: string;
  enterTo: string;
  leaveFrom: string;
  leaveTo: string;
}
export interface DrawerProps {
  className?: string;
  headerClassName?: string;
  headline: string;
  isOpen: boolean;
  overlay?: boolean;
  direction: 'left' | 'right';
  blockScrolling?: boolean;
  onClose?: () => void;
}
