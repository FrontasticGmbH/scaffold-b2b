import { sdk } from '@/sdk';
import getServerOptions from '../getServerOptions';

export const login = () => {
  return sdk.composableCommerce.account.getAccount({ ...getServerOptions() });
};
