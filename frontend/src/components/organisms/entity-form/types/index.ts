export interface EntityFormProps {
  translations: {
    submit?: string;
    cancel?: string;
  };
  classNames?: {
    form?: string;
    buttonsContainer?: string;
  };
  onCancel?: () => void;
  onSubmit?: () => Promise<void>;
}
