import 'server-only';

import { headers } from 'next/headers';
import { constructOrigin } from '../construct-origin';

export const fetchFromHost = (path: string) => {
  //Self origin/host
  const origin = constructOrigin();

  //Nextjs request headers
  const nextHeaders = headers();

  //Netlify firewall bypass header
  const bypassToken = nextHeaders.get('x-nf-waf-bypass-token');

  //Headers to inclued in fetch request
  const requestHeaders = new Headers();

  if (bypassToken) requestHeaders.set('x-nf-waf-bypass-token', bypassToken);

  return fetch(`${origin}${path}`, {
    headers: requestHeaders,
    credentials: 'same-origin',
  });
};
