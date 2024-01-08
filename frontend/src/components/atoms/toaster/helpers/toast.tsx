import { ToastOptions } from 'react-hot-toast';
import { getToast } from './getToast';

const toast = {
  info: (message: string, options?: ToastOptions) => getToast(message, 'info', options),
  success: (message: string, options?: ToastOptions) => getToast(message, 'success', options),
  warning: (message: string, options?: ToastOptions) => getToast(message, 'warning', options),
  error: (message: string, options?: ToastOptions) => getToast(message, 'error', options),
};

export default toast;
