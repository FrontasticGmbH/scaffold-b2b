import { Request } from '@frontastic/extension-types';
import { getProduct, queryCategories } from '../commerce-commercetools/actionControllers/ProductController';
import { Product } from '../../types/product';
import { ProductPaginatedResult } from '../../types/result';
import { dummyAccount, dummyActionContext, commercetoolsFrontendSession } from './data-provider';

jest.setTimeout(10000);

describe.skip('commerce-commercetools:: Project Functionalities', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should test getProduct | should succeed', async function () {
    const mockProduct: Product = {
      productId: 'b275a0a8-2d50-4c29-9882-56f3eb66a83a',
      slug: 'dkny-wallet-R2524504-grey',
      name: 'DKNY – Wallet',
      // other required fields...
    } as Product;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProduct,
      text: async () => JSON.stringify(mockProduct),
    });

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

    const res = await getProduct(request, dummyActionContext);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Product;
    expect(body.productId).toBe(mockProduct.productId);
    expect(body.slug).toEqual(mockProduct.slug);
    expect(body.name).toEqual(mockProduct.name);
  });

  it('should test getProduct by SKU | should succeed', async function () {
    const mockProduct: Product = {
      productId: 'a9eea3e9-4615-41f7-8d83-5238a923b6b0',
      slug: 'altea-scarf-1550732-lightgrey',
      name: 'Altea – Scarf',
    } as Product;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProduct,
      text: async () => JSON.stringify(mockProduct),
    });

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

    const res = await getProduct(request, dummyActionContext);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Product;
    expect(body.productId).toBe(mockProduct.productId);
    expect(body.slug).toBe(mockProduct.slug);
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
      query: '' as unknown as Request['query'], // force error scenario
    };

    await expect(getProduct(request, dummyActionContext)).rejects.toThrow();
  });

  it('should test getProduct | get specific product', async function () {
    const mockProduct: Product = {
      productId: 'b275a0a8-2d50-4c29-9882-56f3eb66a83a',
      name: 'DKNY – Wallet',
      slug: 'dkny-wallet-R2524504-grey',
    } as Product;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProduct,
      text: async () => JSON.stringify(mockProduct),
    });

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

    const res = await getProduct(request, dummyActionContext);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as Product;
    expect(body.productId).toBe(mockProduct.productId);
    expect(body.name).toBe(mockProduct.name);
  });

  it('should test queryCategories | should succeed', async function () {
    const mockResult: ProductPaginatedResult = {
      count: 1,
      total: 1,
      items: [
        {
          productId: 'b275a0a8-2d50-4c29-9882-56f3eb66a83a',
          name: 'DKNY – Wallet',
          slug: 'dkny-wallet-R2524504-grey',
          variants: [],
        },
      ],
      query: {
        slug: 'new-men',
        locale: 'de_DE',
        limit: 1,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResult,
      text: async () => JSON.stringify(mockResult),
    });

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

    const res = await queryCategories(request, dummyActionContext);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as ProductPaginatedResult;
    expect(body.count).toBe(1);
    expect(body.query.slug).toBe('new-men');
  });

  it('should test queryCategories | should fail for non-existent slug', async function () {
    const mockResult: ProductPaginatedResult = {
      count: 0,
      total: 0,
      items: [],
      query: {
        slug: 'new-mens',
        locale: 'de_DE',
        limit: 1,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResult,
      text: async () => JSON.stringify(mockResult),
    });

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

    const res = await queryCategories(request, dummyActionContext);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as ProductPaginatedResult;
    expect(body.count).toBe(0);
    expect(body.total).toBe(0);
    expect(body.items.length).toBe(0);
    expect(body.query.slug).toBe('new-mens');
  });
});
