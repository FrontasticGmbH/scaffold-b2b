import toast from '@/components/atoms/toaster/helpers/toast';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

const useEntityToasters = (entity: string) => {
  const { translate } = useTranslation();

  const showSavedMessage = () => {
    toast.success(translate(`dashboard.entity.${entity}.saved`), {
      position: 'top-right',
    });
  };

  const showFailedMessage = () => {
    toast.error(translate(`dashboard.entity.${entity}.failed`), {
      position: 'top-right',
    });
  };

  const showDeletedMessage = () => {
    toast.success(translate(`dashboard.entity.${entity}.deleted`), {
      position: 'top-right',
    });
  };

  const showDeletedFailedMessage = () => {
    toast.error(translate(`dashboard.entity.${entity}.deleted.failed`), {
      position: 'top-right',
    });
  };

  return { showSavedMessage, showFailedMessage, showDeletedFailedMessage, showDeletedMessage };
};

export default useEntityToasters;
