import { cache } from 'react';
import { sdk } from '@/sdk';
import getServerOptions from '@/utils/server/getServerOptions';

const fetchAssociate = cache(async (loggedIn: boolean) => {
  if (!loggedIn) return { isError: false, data: {} };

  return sdk.composableCommerce.businessUnit.getAssociate(
    { businessUnitKey: undefined as unknown as string },
    { ...(await getServerOptions()) },
  );
});

export default fetchAssociate;
