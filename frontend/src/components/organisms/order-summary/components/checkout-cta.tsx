import { useCallback, useState } from 'react';
import Link from '@/components/atoms/link';
import Button from '@/components/atoms/button';
import { classnames } from '@/utils/classnames/classnames';
import TextArea from '@/components/atoms/text-area';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { CheckoutCTAProps } from '../types';

const CheckoutCTA = ({ className, link, disabled, text, onCheckout, onRequestQuote }: CheckoutCTAProps) => {
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
      <Link href={link} className="w-full" underlineOnHover={false}>
        <Button size="full" disabled={disabled} onClick={onCheckout}>
          {text}
        </Button>
      </Link>

      <Button size="full" variant="secondary" disabled={disabled} onClick={() => setIsSubmittingQuoteRequest(true)}>
        Request Quote
      </Button>
    </div>
  );
};

export default CheckoutCTA;
