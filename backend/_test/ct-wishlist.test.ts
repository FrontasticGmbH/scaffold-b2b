import { Request } from '@frontastic/extension-types';
import { addToWishlist, getWishlist } from '../commerce-commercetools/actionControllers/WishlistController';
import { dummyAccount, dummyActionContext } from './data-provider';

describe.skip('commerce-commercetools:: Wishlist Functionalities', () => {
  let request: Request;

  beforeEach(() => {
    global.fetch = jest.fn(); // native fetch mock

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
    const mockWishlist = {
      wishlistId: 'wishlist-123',
      name: 'My Wishlist',
      wishlistVersion: 2,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockWishlist,
      text: async () => JSON.stringify(mockWishlist),
    });

    const response = await getWishlist(request, dummyActionContext);
    const wishlist = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(wishlist).toHaveProperty('wishlistId');
    expect(response.sessionData.wishlistId).toBeDefined();
    expect(wishlist).toHaveProperty('name');
    expect(wishlist).toHaveProperty('wishlistVersion');
  });

  it.skip('should addToWishlist', async () => {
    const mockWishlist = {
      wishlistId: 'wishlist-456',
      name: 'My Wishlist',
      wishlistVersion: 3,
      anonymousId: 'anon-789',
      lineItems: [
        {
          sku: 'M0E20000000EV28',
          count: 1,
        },
      ],
    };

    request = {
      ...request,
      body: JSON.stringify({
        variant: { sku: 'M0E20000000EV28', count: 1 },
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockWishlist,
      text: async () => JSON.stringify(mockWishlist),
    });

    const response = await addToWishlist(request, dummyActionContext);
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
