export interface ConfirmationProps {
  className?: string;
  translations: {
    title?: string;
    summary?: string;
    confirm?: string;
    cancel?: string;
  };
  isOpen?: boolean;
  disabled?: boolean;
  onConfirm?: () => Promise<void>;
  onCancel?: () => void;
}
