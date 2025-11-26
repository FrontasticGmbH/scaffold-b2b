import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';
import useDisclosure from '@/hooks/useDisclosure';
import { classnames } from '@/utils/classnames/classnames';
import { TagIcon as TagOutlineIcon } from '@heroicons/react/24/outline';
import { TagIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import Accordion from '../accordion';
import { DiscountFormProps } from './types';

const DiscountsForm = ({
  className,
  discounts,
  onSubmit,
  customError,
  onExpanded,
  onCollapsed,
  codeApplied,
}: DiscountFormProps) => {
  const translate = useTranslations();

  const [codeRemovalProcessing, setCodeRemovalProcessing] = useState(false);

  const { isOpen: isExpanded, onOpen: onExpand, onClose: onCollapse } = useDisclosure();

  const [showSuccess, setShowSuccess] = useState(false);

  const {
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<{ code: string }>({
    defaultValues: { code: '' },
    mode: 'onChange',
  });

  const {
    field: { value, onChange, onBlur, ref },
  } = useController({
    name: 'code',
    control,
    rules: { required: translate('common.fieldIsRequired') },
  });

  const discountsContainerClassName = classnames(
    'mt-4 flex flex-col items-stretch gap-3',
    discounts?.length === 0 ? 'pt-0' : 'pt-1',
  );

  const containerClassName = classnames('py-4 text-16 border-t border-gray-300 md:border-t-0', className);

  const onApplyDiscount = async (data: { code: string }) => {
    const code = data.code.trim();

    if (!code) {
      setError('code', { type: 'validate', message: translate('common.fieldIsRequired') });
      return;
    }

    const alreadyExists = discounts.find((discount) => discount.code === code);

    if (alreadyExists) {
      setError('code', { type: 'required', message: translate('cart.discount-coode-already-exists') });
      return;
    }

    const res = await onSubmit?.(code);

    if (!res?.success) {
      setError('code', {
        type: 'manual',
        message: customError || translate('cart.codeNotValid'),
      });
      return;
    } else {
      setShowSuccess(true);
      reset({ code: '' });
    }
  };

  const onClearForm = useCallback(() => {
    setShowSuccess(true);
    reset({ code: '' });
  }, [reset]);

  useEffect(() => {
    if (isSubmitSuccessful) onClearForm();
  }, [onClearForm, isSubmitSuccessful]);

  return (
    <div className={containerClassName}>
      <Accordion
        className="border-0"
        isExpanded={isExpanded}
        onExpand={() => {
          onExpand();
          onExpanded?.();
        }}
        onCollapse={() => {
          onCollapse();
          onCollapsed?.();
        }}
      >
        <Accordion.Button
          defaultSpacing={false}
          className={classnames('text-gray-600', { 'border-b border-gray-300 pb-3': isExpanded })}
        >
          {isExpanded && <>{translate('cart.your-discount-codes')}</>}
          {!isExpanded && (
            <>
              {discounts && discounts.length > 0 ? (
                <div className="flex items-start gap-1">
                  <TagOutlineIcon className="size-5 text-gray-600" />
                  <div>
                    <p className="text-16 font-bold text-gray-600">
                      {translate('cart.n-discounts-applied', { count: discounts.length })}
                    </p>
                    <p className="text-12 font-bold uppercase text-gray-400">{translate('cart.review-add-more')}</p>
                  </div>
                </div>
              ) : (
                <>{translate('cart.discount-apply')}</>
              )}
            </>
          )}
        </Accordion.Button>
        <Accordion.Panel defaultSpacing={false}>
          <form
            className="flex flex-col items-stretch gap-3 pt-4 md:flex-row md:items-start"
            onSubmit={handleSubmit(onApplyDiscount)}
            noValidate
          >
            <Input
              ref={ref}
              value={value}
              onChange={(e) => {
                onChange(e);
                setShowSuccess(false);
              }}
              onBlur={onBlur}
              onFocus={() => {
                setShowSuccess(false);
              }}
              aria-label={translate('cart.discount-code')}
              outerContainerClassName="grow"
              className={classnames(
                errors.code ? 'border-red-500 text-red-500 focus:border-red-500' : 'border-neutral-300',
              )}
              placeholder={translate('cart.discount-enter')}
              disabled={isSubmitting}
              icon={
                errors.code ? (
                  <XMarkIcon
                    className="size-[20px] cursor-pointer"
                    onClick={() => {
                      reset({ code: '' });
                      setShowSuccess(false);
                    }}
                    data-testid="clear-input"
                  />
                ) : null
              }
              error={errors.code?.message}
              success={showSuccess ? codeApplied : undefined}
              valid={showSuccess}
              showValidIcon={false}
              required
            />
            <Button type="submit" className="h-[42px] w-full md:max-w-[110px] md:grow">
              {translate('common.apply')}
            </Button>
          </form>

          {discounts && discounts.length > 0 && (
            <div className={discountsContainerClassName}>
              {discounts.map((discount) => (
                <div
                  key={discount.code}
                  className={classnames(
                    'flex justify-between gap-2 rounded-sm border border-green-300 bg-green-100 px-3 py-2',
                    { 'opacity-50': codeRemovalProcessing },
                  )}
                >
                  <div className="flex items-center gap-2">
                    <TagIcon className="size-4 text-green-700" />
                    <span className="text-14 font-semibold leading-[16px] text-gray-700">{discount.code}</span>
                  </div>
                  <button
                    data-testid="remove-discount-code"
                    type="button"
                    className="shrink-0 text-14 font-semibold text-gray-700 underline underline-offset-2"
                    onClick={async () => {
                      setCodeRemovalProcessing(true);
                      await discount.onRemove?.()?.catch(() => {});
                      setCodeRemovalProcessing(false);
                    }}
                  >
                    {translate('common.remove')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default DiscountsForm;
