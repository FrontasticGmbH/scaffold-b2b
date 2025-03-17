import { useTranslations } from 'use-intl';

const useStatusesOptions = () => {
  const translate = useTranslations();

  const orderStatusOptions = [
    { name: 'Pending', value: 'Open' },
    { name: 'Confirmed', value: 'Confirmed' },
    { name: 'Delivered', value: 'Complete' },
    { name: 'Returned', value: 'Cancelled' },
  ];

  const mapOptions = (options: typeof orderStatusOptions) => {
    return options.map(({ name, value }) => ({
      name: translate(`orders.status-${name.toLowerCase() as 'pending' | 'confirmed' | 'delivered' | 'returned'}`),
      value,
    }));
  };

  return {
    orderStatusOptions: mapOptions(orderStatusOptions),
  };
};

export default useStatusesOptions;
