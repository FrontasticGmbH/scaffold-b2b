import { cache } from 'react';
import { sdk } from '@/sdk';
import getServerOptions from '@/utils/server/getServerOptions';

const fetchProjectSettings = cache(async () => {
  return sdk.composableCommerce.project.getSettings({ ...(await getServerOptions()) });
});

export default fetchProjectSettings;
