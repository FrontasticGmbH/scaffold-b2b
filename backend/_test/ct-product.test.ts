import { Request } from '@frontastic/extension-types';
import { getProduct, queryCategories } from '../commerce-commercetools/actionControllers/ProductController';
import { Product } from '../../types/product';
import { ProductPaginatedResult } from '../../types/result';
import { dummyAccount, dummyActionContext, commercetoolsFrontendSession } from './data-provider';

jest.mock('node-fetch', () => jest.fn());

jest.setTimeout(10000);

describe.skip('commerce-commercetools:: Project Functionalities', () => {
  it('should test getProduct | should succeed', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
      },
      path: '',
      method: 'GET',
      query: {},
    };

    return getProduct(request, dummyActionContext).then((res) => {
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body) as Product;
      expect(body.productId).toBe('b275a0a8-2d50-4c29-9882-56f3eb66a83a');
      expect(body.slug).toEqual('dkny-wallet-R2524504-grey');
      expect(body.name).toEqual('DKNY – Wallet');
    });
  });
  it('should test getProduct by SKU | should succeed', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
        'commercetools-frontend-session': commercetoolsFrontendSession,
      },
      path: '',
      method: 'GET',
      query: {
        sku: 'A0E20000000251J',
      },
    };

    return getProduct(request, dummyActionContext).then((res) => {
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body) as Product;
      expect(body.productId).toBe('a9eea3e9-4615-41f7-8d83-5238a923b6b0');
      expect(body.slug).toBe('altea-scarf-1550732-lightgrey');
    });
  });

  it('should test getProduct | should throw as query is a string', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
      },
      path: '',
      method: 'GET',
      query: '',
    };

    await expect(getProduct(request, dummyActionContext)).rejects.toThrow();
  });
  it('should test getProduct | get specific product', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
        'commercetools-frontend-session': commercetoolsFrontendSession,
      },
      path: '',
      method: 'GET',
      query: {
        limit: 1,
        productIds: ['b275a0a8-2d50-4c29-9882-56f3eb66a83a'],
      },
    };

    return getProduct(request, dummyActionContext).then((res) => {
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body) as Product;
      expect(body.productId).toBe('b275a0a8-2d50-4c29-9882-56f3eb66a83a');
      expect(body.name).toBe('DKNY – Wallet');
    });
  });

  it('should test queryCategories | should succeed', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
        'commercetools-frontend-session': commercetoolsFrontendSession,
      },
      path: '',
      method: 'GET',
      query: {
        limit: 1,
        locale: 'de_DE',
        slug: 'new-men',
      },
    };

    return queryCategories(request, dummyActionContext).then((res) => {
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body) as ProductPaginatedResult;
      expect(body.count).toBe(1);
      expect(body.query.slug).toBe('new-men');
    });
  });

  it('should test queryCategories | should fail for non-existent slug', async function () {
    const request: Request = {
      body: JSON.stringify(dummyAccount),
      sessionData: '',
      headers: {
        'commercetools-frontend-locale': 'en_US',
        'commercetools-frontend-session': commercetoolsFrontendSession,
      },
      path: '',
      method: 'GET',
      query: {
        limit: 1,
        locale: 'de_DE',
        slug: 'new-mens',
      },
    };

    return queryCategories(request, dummyActionContext).then((res) => {
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body) as ProductPaginatedResult;
      expect(body.count).toBe(0);
      expect(body.total).toBe(0);
      expect(body.items.length).toBe(0);
      expect(body.query.slug).toBe('new-mens');
    });
  });
});
