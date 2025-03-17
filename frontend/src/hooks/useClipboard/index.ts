import { useCallback } from 'react';
import toast from '@/components/atoms/toaster/helpers/toast';
import { useTranslations } from 'use-intl';

const useClipboard = () => {
  const translate = useTranslations();

  const onSuccess = useCallback(() => {
    toast.success(translate('common.copy-clipboard-success'), { position: 'top-right' });
  }, [translate]);

  const onError = useCallback(() => {
    toast.error(translate('common.copy-clipboard-error'), { position: 'top-right' });
  }, [translate]);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        onSuccess();
      } catch {
        onError();
      }
    },
    [onSuccess, onError],
  );

  return { copyToClipboard };
};

export default useClipboard;
