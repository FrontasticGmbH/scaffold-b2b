import { useTranslations } from 'use-intl';

const useStatusesOptions = () => {
  const translate = useTranslations();

  const quoteStatusOptions = [
    { name: 'Accepted', value: 'Accepted' },
    { name: 'Declined', value: 'Declined' },
    { name: 'DeclinedForRenegotiation', value: 'DeclinedForRenegotiation' },
    { name: 'RenegotiationAddressed', value: 'RenegotiationAddressed' },
    { name: 'Pending', value: 'Pending' },
    { name: 'Withdrawn', value: 'Withdrawn' },
  ];

  const quoteRequestStatusOptions = [
    { name: 'Accepted', value: 'Accepted' },
    { name: 'Cancelled', value: 'Cancelled' },
    { name: 'Closed', value: 'Closed' },
    { name: 'Rejected', value: 'Rejected' },
    { name: 'Submitted', value: 'Submitted' },
  ];

  const mapOptions = (options: typeof quoteStatusOptions | typeof quoteRequestStatusOptions) => {
    return options.map(({ name, value }) => ({
      name: translate(
        `dashboard.quote-status-${name.toLowerCase() as 'accepted' | 'cancelled' | 'closed' | 'rejected' | 'submitted'}`,
      ),
      value,
    }));
  };

  return {
    quoteStatusOptions: mapOptions(quoteStatusOptions),
    quoteRequestStatusOptions: mapOptions(quoteRequestStatusOptions),
  };
};

export default useStatusesOptions;
