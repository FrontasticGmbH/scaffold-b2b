import useTranslation from '@/providers/I18n/hooks/useTranslation';

const useStatusesOptions = () => {
  const { translate } = useTranslation();

  const quoteStatusOptions = [
    { name: 'Accepted', value: 'Accepted', count: 0 },
    { name: 'Declined', value: 'Declined', count: 0 },
    { name: 'DeclinedForRenegotiation', value: 'DeclinedForRenegotiation', count: 0 },
    { name: 'RenegotiationAddressed', value: 'RenegotiationAddressed', count: 0 },
    { name: 'Pending', value: 'Pending', count: 0 },
    { name: 'Withdrawn', value: 'Withdrawn', count: 0 },
  ];

  const quoteRequestStatusOptions = [
    { name: 'Accepted', value: 'Accepted', count: 0 },
    { name: 'Cancelled', value: 'Cancelled', count: 0 },
    { name: 'Closed', value: 'Closed', count: 0 },
    { name: 'Rejected', value: 'Rejected', count: 0 },
    { name: 'Submitted', value: 'Submitted', count: 0 },
  ];

  const mapOptions = (options: typeof quoteStatusOptions | typeof quoteRequestStatusOptions) => {
    return options.map(({ name, value, count }) => ({
      name: translate(`dashboard.quote.status.${name.toLowerCase()}`),
      value,
      count,
    }));
  };

  return {
    quoteStatusOptions: mapOptions(quoteStatusOptions),
    quoteRequestStatusOptions: mapOptions(quoteRequestStatusOptions),
  };
};

export default useStatusesOptions;
