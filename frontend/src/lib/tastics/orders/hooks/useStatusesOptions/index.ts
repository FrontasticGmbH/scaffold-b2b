import useTranslation from '@/providers/I18n/hooks/useTranslation';

const useStatusesOptions = () => {
  const { translate } = useTranslation();

  const orderStatusOptions = [
    { name: 'Pending', value: 'Open' },
    { name: 'Confirmed', value: 'Confirmed' },
    { name: 'Delivered', value: 'Complete' },
    { name: 'Returned', value: 'Cancelled' },
  ];

  const mapOptions = (options: typeof orderStatusOptions) => {
    return options.map(({ name, value }) => ({
      name: translate(`orders.status.${name.toLowerCase()}`),
      value,
    }));
  };

  return {
    orderStatusOptions: mapOptions(orderStatusOptions),
  };
};

export default useStatusesOptions;
