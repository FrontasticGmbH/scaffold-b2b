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

const getToastDuration = (message: string) => (message.length >= 120 ? 5000 : 3000);

const getToastOptions: GetToastOptions = (message, variant, options) => {
  const Icon = toastThemeRef[variant].icon;

  return [
    message,
    {
      style: {
        backgroundColor: toastThemeRef[variant].backgroundColor,
      },
      icon: <Icon className={classnames('h-6 w-6 stroke-white stroke-[0.5px]', toastThemeRef[variant].fill)} />,
      duration: getToastDuration(message),
      ...options,
    },
  ];
};

export const getToast: GetToast = (...props) => ReactToast(...getToastOptions(...props));
