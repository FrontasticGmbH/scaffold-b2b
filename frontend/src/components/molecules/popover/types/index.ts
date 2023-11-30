export interface Props {
  isOpen: boolean;
  onClose?: () => void;
  direction: 'left' | 'right';
  buttonElement: () => React.JSX.Element;
}
