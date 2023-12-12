import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Discount } from '@shared/types/cart/Discount';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { classnames } from '@/utils/classnames/classnames';
import Input from '@/components/atoms/input';
import Accordion from '../../../molecules/accordion';
import { DiscountFormProps } from '../types';

const DiscountForm = ({ className }: DiscountFormProps) => {
  const { translate } = useTranslation();

  const [code, setCode] = useState('');
  const [discounts] = useState<Discount[]>([]);
  const [codeIsInvalid, setCodeIsInvalid] = useState(false);

  const [processing, setProcessing] = useState(false);

  const inputClassName = classnames(
    codeIsInvalid ? 'border-red-500 text-red-500 focus:border-red-500' : 'border-neutral-300',
  );

  const discountsContainerClassName = classnames(
    'mt-2 flex flex-wrap justify-items-start gap-3',
    discounts?.length === 0 ? 'pt-0' : 'pt-1',
  );

  const containerClassName = classnames('border-t border-neutral-400 py-4 text-16', className);

  const onApplyDiscount = () => {
    if (processing || !code) return;

    setProcessing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setCodeIsInvalid(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyDiscount();
  };

  return (
    <div className={containerClassName}>
      <Accordion className="border-0">
        <Accordion.Button defaultSpacing={false} className="text-neutral-900">
          {translate('cart.discount.apply')}
        </Accordion.Button>
        <Accordion.Panel defaultSpacing={false}>
          <form className="pt-6" onSubmit={handleSubmit}>
            <Input
              className={inputClassName}
              value={code}
              placeholder={translate('cart.discount.enter')}
              onChange={handleChange}
              disabled={processing}
              icon={codeIsInvalid ? <XMarkIcon className="h-1 w-1 cursor-pointer" /> : null}
              error={codeIsInvalid ? translate('cart.codeNotValid') : undefined}
            />
          </form>

          {discounts && !!discounts.length && (
            <div className={discountsContainerClassName}>
              {discounts.map((discount) => (
                <div
                  key={discount.discountId}
                  className="mr-1 flex w-fit justify-between gap-2 rounded-sm border border-neutral-400 bg-white px-2 py-1"
                >
                  <label className="text-12 uppercase leading-[16px] text-secondary">{discount.code}</label>
                  <button type="button">
                    <XMarkIcon className="h-1 w-1 text-secondary" />
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

export default DiscountForm;
