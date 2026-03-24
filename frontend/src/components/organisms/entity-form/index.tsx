import React, { useCallback, useState } from 'react';
import Button from '@/components/atoms/button';
import { classnames } from '@/utils/classnames/classnames';
import { EntityFormProps } from './types';

const EntityForm = ({
  children,
  translations,
  onCancel,
  onSubmit,
  unstyled = false,
  classNames = {},
  showCancelButton = true,
  showSubmitButton = true,
}: React.PropsWithChildren<EntityFormProps>) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoading(true);
      await onSubmit?.();
      setIsLoading(false);
    },
    [onSubmit],
  );

  return (
    <form
      className={classnames({ 'rounded-md border-neutral-400 md:border md:p-5 md:pb-6': !unstyled }, classNames.form)}
      onSubmit={handleSubmit}
      noValidate
    >
      {children}
      <div
        className={classnames('flex items-center gap-3', classNames.buttonsContainer, {
          'pt-8': showSubmitButton || showCancelButton,
        })}
      >
        {showCancelButton && (
          <Button variant="secondary" size="m" onClick={onCancel} type="button" className="min-w-[112px]">
            {translations.cancel}
          </Button>
        )}
        {showSubmitButton && (
          <Button variant="primary" size="m" type="submit" loading={isLoading} className="min-w-[112px]">
            {translations.submit}
          </Button>
        )}
      </div>
    </form>
  );
};

export default EntityForm;
