import 'server-only';
import { headers } from 'next/headers';

export const constructOrigin = () => {
  const nextHeaders = headers();

  const protocol = nextHeaders.get('x-forwarded-proto') ?? 'https';
  const host = nextHeaders.get('host');

  return `${protocol}://${host}`;
};
