import { Request } from '@frontastic/extension-types';
import { AccountAuthenticationError } from '../errors/AccountAuthenticationError';
import { fetchAccountFromSession } from './fetchAccountFromSession';

export function assertIsAuthenticated(request: Request) {
  const account = fetchAccountFromSession(request);

  if (account === undefined) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }

  return account;
}
