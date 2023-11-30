import { CheckCircleIcon } from '@heroicons/react/24/solid';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastThemeRef = {
  [key in ToastVariant]: { backgroundColor: string; fill: string; icon: typeof CheckCircleIcon };
};
