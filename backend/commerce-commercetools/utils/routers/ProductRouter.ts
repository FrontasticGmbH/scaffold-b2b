import { Product } from '@Types/product/Product';
import { Context, Request } from '@frontastic/extension-types';
import { ProductQuery } from '@Types/query/ProductQuery';
import { LineItem } from '@Types/cart/LineItem';
import { LineItem as WishlistItem } from '@Types/wishlist/LineItem';
import {
  getDistributionChannelId,
  getPath,
  getStoreId,
  getStoreKey,
  getSupplyChannelId,
} from '../requestHandlers/Request';
import getProductApi from '@Commerce-commercetools/utils/apiConstructors/getProductApi';

export default class ProductRouter {
  static generateUrlFor(item: Product | LineItem | WishlistItem) {
    if (ProductRouter.isProduct(item)) {
      return `/${item.slug}/p/${item.variants?.[0]?.sku}`;
    }
    return `/slug/p/${item.variant?.sku}`;
  }

  static identifyFrom(request: Request) {
    if (getPath(request)?.match(/\/p\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static identifyPreviewFrom(request: Request) {
    if (getPath(request)?.match(/\/preview\/.+\/p\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, commercetoolsFrontendContext: Context): Promise<Product> => {
    const productApi = getProductApi(request, commercetoolsFrontendContext);
    const urlMatches = getPath(request)?.match(/\/p\/([^\/]+)/);

    if (urlMatches) {
      const productQuery: ProductQuery = {
        skus: [urlMatches[1]],
        storeKey: getStoreKey(request),
        distributionChannelId: getDistributionChannelId(request),
        supplyChannelId: getSupplyChannelId(request),
        storeId: getStoreId(request),
      };

      return productApi.getProduct(productQuery);
    }

    return null;
  };

  static loadPreviewFor = async (request: Request, commercetoolsFrontendContext: Context): Promise<Product> => {
    const productApi = getProductApi(request, commercetoolsFrontendContext);
    const urlMatches = getPath(request)?.match(/\/preview\/.+\/p\/([^\/]+)/);

    if (urlMatches) {
      const productQuery: ProductQuery = {
        skus: [urlMatches[1]],
        storeKey: getStoreKey(request),
        distributionChannelId: getDistributionChannelId(request),
        supplyChannelId: getSupplyChannelId(request),
      };

      return productApi.getProduct(productQuery);
    }

    return null;
  };

  private static isProduct(product: Product | LineItem | WishlistItem): product is Product {
    return (product as Product).variants !== undefined;
  }
}
