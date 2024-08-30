import { toast as ReactToast, ToastOptions } from 'react-hot-toast';
import { getToast } from './getToast';
import { ToastVariant } from '../types';

const toast = {
  info: (message: string, options?: ToastOptions) => getToast(message, 'info', options),
  success: (message: string, options?: ToastOptions) => getToast(message, 'success', options),
  warning: (message: string, options?: ToastOptions) => getToast(message, 'warning', options),
  error: (message: string, options?: ToastOptions) => getToast(message, 'error', options),
  render: (element: JSX.Element, variant: ToastVariant, options?: ToastOptions) => getToast(element, variant, options),
  removeAll: () => ReactToast.remove(),
};

export default toast;
