import toast from '@/components/atoms/toaster/helpers/toast';
import { useTranslations } from 'use-intl';

const useEntityToasters = (entity: 'address' | 'associate' | 'businessunit' | 'purchaselist') => {
  const translate = useTranslations();

  const showSavedMessage = () => {
    toast.success(translate(`dashboard.entity-${entity}-saved`), {
      position: 'top-right',
    });
  };

  const showFailedMessage = () => {
    toast.error(translate(`dashboard.entity-${entity}-failed`), {
      position: 'top-right',
    });
  };

  const showDeletedMessage = () => {
    toast.success(translate(`dashboard.entity-${entity}-deleted`), {
      position: 'top-right',
    });
  };

  const showDeletedFailedMessage = () => {
    toast.error(translate(`dashboard.entity-${entity}-deleted-failed`), {
      position: 'top-right',
    });
  };

  return { showSavedMessage, showFailedMessage, showDeletedFailedMessage, showDeletedMessage };
};

export default useEntityToasters;
