export interface EntityFormProps {
  translations: {
    submit?: string;
    cancel?: string;
  };
  unstyled?: boolean;
  classNames?: {
    form?: string;
    buttonsContainer?: string;
  };
  showCancelButton?: boolean;
  showSubmitButton?: boolean;
  stackButtonsOnMobile?: boolean;
  onCancel?: () => void;
  onSubmit?: () => Promise<void>;
}
