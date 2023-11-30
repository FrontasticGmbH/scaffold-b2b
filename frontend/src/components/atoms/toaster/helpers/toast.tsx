import { toast as ReactToast } from 'react-hot-toast';
import { getToastOptions } from './getToastOptions';

const toast = {
  info: (message: string) => ReactToast(message, getToastOptions('info')),
  success: ReactToast.success,
  warning: (message: string) => ReactToast(message, getToastOptions('warning')),
  error: ReactToast.error,
};

export default toast;
