import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';
import { toast as ReactToast } from 'react-hot-toast';
import { GetToast, GetToastOptions, ToastThemeRef } from '../types';

const toastThemeRef: ToastThemeRef = {
  info: { backgroundColor: '#EAF2FC', fill: 'fill-blue-500', icon: InformationCircleIcon },
  success: { backgroundColor: '#EEFBF6', fill: 'fill-green-500', icon: CheckCircleIcon },
  warning: { backgroundColor: '#FEF9EB', fill: 'fill-yellow-500', icon: ExclamationCircleIcon },
  error: { backgroundColor: '#FAEEEE', fill: 'fill-red-500', icon: ExclamationCircleIcon },
};

const getToastDuration = (length: number) => (length >= 120 ? 5000 : 3000);

export const getToastOptions: GetToastOptions = (letters, variant, options) => {
  const Icon = toastThemeRef[variant].icon;

  return {
    style: {
      backgroundColor: toastThemeRef[variant].backgroundColor,
    },
    icon: <Icon className={classnames('size-6 stroke-white stroke-[0.5px]', toastThemeRef[variant].fill)} />,
    duration: getToastDuration(letters),
    ...options,
  };
};

export const getToast: GetToast = (message, ...props) => {
  if (typeof message === 'string') return ReactToast(message, getToastOptions(message.length, ...props));
  else return ReactToast(message, getToastOptions(130, ...props));
};
