import { useCallback } from 'react';
import Link from '@/components/atoms/link';
import Button from '@/components/atoms/button';
import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import toast from '@/components/atoms/toaster/helpers/toast';
import { CheckoutCTAProps } from '../types';

const CheckoutCTA = ({
  className,
  link,
  quoteCheckoutLink,
  disabled,
  text,
  onCheckout,
  checkoutDisabled,
  quoteRequestDisabled,
}: CheckoutCTAProps) => {
  const translate = useTranslations();

  const handleDisabledClick = useCallback(() => {
    if (!disabled) return;

    toast.error(translate('cart.attempt-with-outofstock-item'), { position: 'top-right' });
  }, [disabled, translate]);

  const CTAClassName = classnames(className, 'gap-4');

  return (
    <div className={CTAClassName}>
      <Link
        href={!(disabled || checkoutDisabled) ? link : '#'}
        className="w-full"
        underlineOnHover={false}
        onClick={handleDisabledClick}
      >
        <Button size="full" disabled={disabled || checkoutDisabled} onClick={onCheckout}>
          {text}
        </Button>
      </Link>

      <Link
        href={!(disabled || quoteRequestDisabled) ? quoteCheckoutLink : '#'}
        className="w-full"
        underlineOnHover={false}
        onClick={handleDisabledClick}
      >
        <Button size="full" variant="secondary" disabled={disabled || quoteRequestDisabled}>
          {translate('cart.request-quote')}
        </Button>
      </Link>
    </div>
  );
};

export default CheckoutCTA;
