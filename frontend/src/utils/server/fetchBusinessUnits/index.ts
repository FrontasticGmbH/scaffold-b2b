import { cache } from 'react';
import { sdk } from '@/sdk';
import getServerOptions from '@/utils/server/getServerOptions';

const fetchBusinessUnits = cache(async (loggedIn: boolean) => {
  if (!loggedIn) return { isError: false, data: [] };

  return sdk.composableCommerce.businessUnit.getBusinessUnits(
    { expandStores: true },
    { ...(await getServerOptions()) },
  );
});

export default fetchBusinessUnits;
