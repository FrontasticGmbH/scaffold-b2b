'server only';

import { Params } from '@/types/next';
import { login } from '../login';

export const authenticate = async (slug: Params['slug']) => {
  const authWhiteList = ['verify', 'verify-associate', 'login', 'register', 'reset-password', '404'];

  const response = await login();

  const loggedIn = !response.isError && response.data.loggedIn;

  const attemptingToAuth = slug && authWhiteList.includes(slug[0]);

  return { loggedIn, attemptingToAuth, auth: response };
};
