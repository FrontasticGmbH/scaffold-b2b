import 'server-only';

import { cache } from 'react';
import { sdk } from '@/sdk';
import getServerOptions from '@/utils/server/getServerOptions';

const fetchCategories = cache((format: 'tree' | 'flat' = 'flat', limit = 500) => {
  return sdk.composableCommerce.product.queryCategories({ format, limit }, { ...getServerOptions() });
});

export default fetchCategories;
