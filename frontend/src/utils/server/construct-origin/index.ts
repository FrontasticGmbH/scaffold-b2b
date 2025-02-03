import 'server-only';
import { headers } from 'next/headers';

export const constructOrigin = async () => {
  const nextHeaders = await headers();

  const protocol = nextHeaders.get('x-forwarded-proto') ?? 'https';
  const host = nextHeaders.get('host');

  return `${protocol}://${host}`;
};
