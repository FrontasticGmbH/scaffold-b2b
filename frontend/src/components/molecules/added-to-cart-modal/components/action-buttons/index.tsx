import React from 'react';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

type PropsType = {
  onClose: () => void;
};
const ActionButtons = ({ onClose }: PropsType) => {
  const { translate } = useTranslation();

  return (
    <div className={'col-span-6 mt-8 grid gap-3 md:mt-12 md:grid-cols-2'}>
      <Button
        className="row-start-2 h-10 w-full md:col-start-1 md:row-start-1"
        variant={'secondary'}
        onClick={() => onClose()}
      >
        {translate('cart.continue.shopping')}
      </Button>
      <Link href="/cart" underlineOnHover={false} className="row-start-1 h-10 w-full">
        <Button className={'h-full w-full'} variant="primary">
          {translate('cart.go')}
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
