import { cache } from 'react';
import { sdk } from '@/sdk';
import getServerOptions from '@/utils/server/getServerOptions';

const fetchBusinessUnits = cache(() => {
  return sdk.composableCommerce.businessUnit.getBusinessUnits({ expandStores: true }, { ...getServerOptions() });
});

export default fetchBusinessUnits;
