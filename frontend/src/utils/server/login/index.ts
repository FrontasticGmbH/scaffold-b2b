import { AccountResult } from '@/types/lib/account';
import { sdk } from '@/sdk';
import getServerOptions from '../getServerOptions';

export const login = () => {
  return sdk.callAction<AccountResult>({
    actionName: 'account/getAccount',
    ...getServerOptions(),
  });
};
