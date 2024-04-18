import { cache } from 'react';
import { sdk } from '@/sdk';
import getServerOptions from '@/utils/server/getServerOptions';

const fetchBusinessUnits = cache((loggedIn: boolean) => {
  if (!loggedIn) return { isError: false, data: [] };

  return sdk.composableCommerce.businessUnit.getBusinessUnits({ expandStores: true }, { ...getServerOptions() });
});

export default fetchBusinessUnits;
