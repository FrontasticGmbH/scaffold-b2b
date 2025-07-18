import React, { useCallback } from 'react';
import useControllableState from '@/hooks/useControllableState';
import { classnames } from '@/utils/classnames/classnames';
import { ToggleProps } from './types';

const Toggle = ({ label, checked: checkedProp, defaultChecked = false, onChange, disabled }: ToggleProps) => {
  const [checked, setChecked] = useControllableState(checkedProp, defaultChecked);

  const handleChange = useCallback(
    (checkedVal: boolean) => {
      setChecked(checkedVal);
      onChange?.(checkedVal);
    },
    [setChecked, onChange],
  );

  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-3">
      {label && <div className="font-medium text-gray-700">{label}</div>}
      <div className={classnames('relative', { 'cursor-not-allowed': disabled })}>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={classnames(
            'block h-8 w-14 rounded-full border border-neutral-400',
            disabled ? 'bg-neutral-200' : checked ? 'bg-secondary' : 'bg-white',
          )}
        ></div>
        <div
          className={classnames(
            'absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-neutral-100 transition',
            { 'translate-x-full': checked },
            { 'bg-neutral-500': disabled },
          )}
        >
          <span data-testid="checked-icon" className={!checked ? 'hidden' : 'block'}>
            <svg
              className="stroke-secondary"
              width="11"
              height="8"
              viewBox="0 0 11 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                strokeWidth="1"
              ></path>
            </svg>
          </span>
          <span data-testid="unchecked-icon" className={checked ? 'hidden' : 'block'}>
            <svg className="size-4 stroke-secondary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </span>
        </div>
      </div>
    </label>
  );
};

export default Toggle;
