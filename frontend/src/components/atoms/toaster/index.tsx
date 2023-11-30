'use client';

import React from 'react';
import { Toaster as ReactToaster, ToastBar, toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getToastOptions } from './helpers/getToastOptions';
import ToastMessage from './components/toast-message';

const Toaster = () => {
  return (
    <ReactToaster
      toastOptions={{
        success: getToastOptions('success'),
        error: getToastOptions('error'),
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            width: '400px',
            padding: '12px',
            boxShadow: '-1px 8px 24px 0px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.05);',
          }}
        >
          {({ icon, message }) => (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="block shrink-0">{icon}</span>
                <ToastMessage>{message}</ToastMessage>
              </div>
              <XMarkIcon className="h-5 w-5 shrink-0 hover:cursor-pointer" onClick={() => toast.dismiss(t.id)} />
            </div>
          )}
        </ToastBar>
      )}
    </ReactToaster>
  );
};

export default Toaster;
