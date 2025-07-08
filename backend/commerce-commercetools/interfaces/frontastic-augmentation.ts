/**
 * Module augmentation for '@frontastic/extension-types'.
 *
 * Purpose:
 * - Provide type-safe `sessionData` properties on the `Request` interface
 * - Avoid usage of `any` in request handlers
 */

import '@frontastic/extension-types';
import { Token } from '@Types/Token';

declare module '@frontastic/extension-types' {
  interface Request {
    sessionData: SessionData;
  }
}

interface SessionData {
  checkoutSessionToken?: Record<string, Token>;
  accountId?: string;
  accountGroupId?: string;
  wishlistId?: string;
  cartId?: string;
}
