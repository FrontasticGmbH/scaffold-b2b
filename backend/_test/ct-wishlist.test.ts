import { Request } from '@frontastic/extension-types';
import { addToWishlist, getWishlist } from '../commerce-commercetools/actionControllers/WishlistController';
import { dummyAccount, dummyActionContext } from './data-provider';

describe.skip('commerce-commercetools:: Wishlist Functionalities', () => {
  let request: Request;
  beforeEach(() => {
    request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_GB',
        'commercetools-frontend-currency': 'EUR',
      },
      path: '',
      method: 'GET',
      query: {},
    };
  });
  it.skip('should getWishlists', async () => {
    return await getWishlist(request, dummyActionContext).then((response) => {
      const wishlist = JSON.parse(response.body);
      expect(response.statusCode).toBe(200);
      expect(wishlist).toHaveProperty('wishlistId');
      expect(response.sessionData.wishlistId).toBeDefined();
      expect(wishlist).toHaveProperty('name');
      expect(wishlist).toHaveProperty('wishlistVersion');
    });
  });
  it.skip('should addToWishlist', async () => {
    request = {
      ...request,
      body: JSON.stringify({
        variant: { sku: 'M0E20000000EV28', count: 1 },
      }),
    };
    return await addToWishlist(request, dummyActionContext).then((response) => {
      const wishlist = JSON.parse(response.body);
      expect(response.statusCode).toBe(200);
      expect(wishlist).toHaveProperty('wishlistId');
      expect(response.sessionData.wishlistId).toBeDefined();
      expect(wishlist).toHaveProperty('name');
      expect(wishlist).toHaveProperty('wishlistVersion');
      expect(wishlist).toHaveProperty('anonymousId');
      expect(wishlist).toHaveProperty('lineItems');
      expect(wishlist.lineItems).toBeInstanceOf(Array);
    });
  });
});
