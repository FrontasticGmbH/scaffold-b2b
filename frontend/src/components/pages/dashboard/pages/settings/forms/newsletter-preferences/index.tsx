import React, { useCallback, useState } from 'react';
import Button from '@/components/atoms/button';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Radio from '@/components/atoms/radio';
import { Props } from './types';

const NewsletterPreferencesForm = ({ onCancel, onUpdateNewsletterPreferences }: Props) => {
  const { translate } = useTranslation();

  const [subscribe, setSubscribe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoading(true);
      await onUpdateNewsletterPreferences?.(subscribe);
      setIsLoading(false);
    },
    [onUpdateNewsletterPreferences, subscribe],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <Radio
          checked={subscribe}
          label={translate('dashboard.want.to.subscribe')}
          onSelected={() => setSubscribe(true)}
        />
        <Radio
          checked={!subscribe}
          label={translate('dashboard.not.want.to.subscribe')}
          onSelected={() => setSubscribe(false)}
        />
      </div>

      <div className="flex items-center gap-3 pt-6">
        <Button variant="secondary" onClick={onCancel} type="button" className="min-w-[112px]">
          {translate('common.cancel')}
        </Button>
        <Button variant="primary" type="submit" loading={isLoading} className="min-w-[112px]">
          {translate('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterPreferencesForm;
