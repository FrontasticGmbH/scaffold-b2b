import { Request } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';

export function fetchAccountFromSession(request: Request): Account | undefined {
  if (request.sessionData?.account !== undefined) {
    return request.sessionData.account;
  }

  return undefined;
}

export function fetchAccountFromSessionEnsureLoggedIn(request: Request): Account {
  const account = fetchAccountFromSession(request);
  if (!account) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }
  return account;
}
