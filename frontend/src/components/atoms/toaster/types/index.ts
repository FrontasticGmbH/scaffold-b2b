import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { toast as ReactToast, ToastOptions } from 'react-hot-toast';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastThemeRef = {
  [key in ToastVariant]: { backgroundColor: string; fill: string; icon: typeof CheckCircleIcon };
};

export type CommonProps = [string, ToastVariant, ToastOptions | undefined];
export type GetToastOptions = (...args: CommonProps) => [string, ToastOptions];

export type GetToast = (...args: CommonProps) => ReturnType<typeof ReactToast>;
