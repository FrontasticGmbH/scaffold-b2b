import useTranslation from '@/providers/I18n/hooks/useTranslation';

const useStatusesOptions = () => {
  const { translate } = useTranslation();

  const orderStatusOptions = [
    { name: 'Pending', value: 'Open', count: 0 },
    { name: 'Confirmed', value: 'Confirmed', count: 0 },
    { name: 'Delivered', value: 'Delivered', count: 0 },
    { name: 'Cancelled', value: 'Cancelled', count: 0 },
    { name: 'Returned', value: 'Returned', count: 0 },
  ];

  const mapOptions = (options: typeof orderStatusOptions) => {
    return options.map(({ name, value, count }) => ({
      name: translate(`orders.status.${name.toLowerCase()}`),
      value,
      count,
    }));
  };

  return {
    orderStatusOptions: mapOptions(orderStatusOptions),
  };
};

export default useStatusesOptions;
