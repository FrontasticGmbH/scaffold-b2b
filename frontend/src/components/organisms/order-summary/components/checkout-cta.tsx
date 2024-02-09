import { useCallback, useState } from 'react';
import Link from '@/components/atoms/link';
import Button from '@/components/atoms/button';
import { classnames } from '@/utils/classnames/classnames';
import TextArea from '@/components/atoms/text-area';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import toast from '@/components/atoms/toaster/helpers/toast';
import { CheckoutCTAProps } from '../types';
import Confirmation from '../../confirmation';

const CheckoutCTA = ({
  className,
  link,
  disabled,
  text,
  onCheckout,
  onRequestQuote,
  isQuotationCart,
  onClear,
}: CheckoutCTAProps) => {
  const { translate } = useTranslation();

  const [isSubmittingQuoteRequest, setIsSubmittingQuoteRequest] = useState(false);

  const [comment, setComment] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuoteSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsProcessing(true);

      await onRequestQuote({ buyerComment: comment });

      setIsProcessing(false);
      setIsSubmittingQuoteRequest(false);
    },
    [comment, onRequestQuote],
  );

  const handleDisabledClick = useCallback(() => {
    if (!disabled) return;

    toast.error(translate('cart.attempt.with.outofstock.item'), { position: 'top-right' });
  }, [disabled, translate]);

  const CTAClassName = classnames(className, 'gap-4');

  if (isSubmittingQuoteRequest) {
    return (
      <form className={CTAClassName} onSubmit={handleQuoteSubmit}>
        <TextArea label={translate('common.comment')} onChange={(e) => setComment(e.target.value)} />
        <div className="mt-5 w-full">
          <Button className="capitalize" size="full" loading={isProcessing} type="submit">
            {translate('cart.submit.quote')}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className={CTAClassName}>
      <Link href={!disabled ? link : '#'} className="w-full" underlineOnHover={false} onClick={handleDisabledClick}>
        <Button size="full" disabled={disabled} onClick={onCheckout}>
          {text}
        </Button>
      </Link>

      {!isQuotationCart && (
        <Button size="full" variant="secondary" disabled={disabled} onClick={() => setIsSubmittingQuoteRequest(true)}>
          {translate('cart.request.quote')}
        </Button>
      )}

      {isQuotationCart && (
        <Confirmation
          onConfirm={onClear}
          translations={{
            title: translate('cart.clear.quote'),
            summary: translate('cart.clear.quote.desc'),
            confirm: translate('common.delete'),
            cancel: translate('common.cancel'),
          }}
        >
          <p className="mt-3 cursor-pointer text-center font-medium capitalize text-primary">
            {translate('cart.clear.quote')}
          </p>
        </Confirmation>
      )}
    </div>
  );
};

export default CheckoutCTA;
