'server only';

import { redirect } from 'next/navigation';
import { Params } from '@/types/next';
import { login } from '../login';

export const authenticate = async (slug: Params['slug']) => {
  const authWhiteList = ['verify', 'login', 'register', 'reset-password'];

  const response = await login();

  if (response.isError) return;

  const loggedIn = response.data.loggedIn;
  const attemptingToAuth = slug && authWhiteList.includes(slug[0]);

  if (!loggedIn && !attemptingToAuth) redirect('/login');

  if (loggedIn && attemptingToAuth) redirect('/');

  return response.data;
};
