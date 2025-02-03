import { sdk } from '@/sdk';
import getServerOptions from '../getServerOptions';

export const login = async () => {
  return sdk.composableCommerce.account.getAccount({ ...(await getServerOptions()) });
};
