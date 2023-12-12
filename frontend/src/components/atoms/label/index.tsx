import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { LabelProps } from './types';

const Label = ({
  children,
  required,
  showOptionalLabel,
  requiredStyle = 'asterisk',
}: React.PropsWithChildren<LabelProps>) => {
  const { translate } = useTranslation();

  if (!children && !required) return <></>;

  return (
    <div className="mb-2 flex items-center justify-between">
      {children && (
        <label className="block text-14">
          <span className="text-gray-700">{children}</span>{' '}
          {!required && showOptionalLabel && (
            <span className="lowercase text-gray-600">({translate('common.optional')})</span>
          )}
          {required && requiredStyle === 'asterisk' && <span>*</span>}
        </label>
      )}
      {required && requiredStyle === 'label' && (
        <span className="text-12 text-gray-500">{translate('common.field.required')}</span>
      )}
    </div>
  );
};

export default Label;
