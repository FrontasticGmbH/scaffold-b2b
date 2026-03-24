import { Product } from '@Types/product/Product';
import { Context, Request } from '@frontastic/extension-types';
import { ProductQuery } from '@Types/query/ProductQuery';
import { LineItem } from '@Types/cart/LineItem';
import { LineItem as WishlistItem } from '@Types/wishlist/LineItem';
import {
  getAccountGroupId,
  getDistributionChannelId,
  getPath,
  getProductSelectionId,
  getStoreId,
  getStoreKey,
  getSupplyChannelId,
} from '../requestHandlers/Request';
import getProductApi from '@Commerce-commercetools/utils/apiConstructors/getProductApi';

export default class ProductRouter {
  private static isProduct(product: Product | LineItem | WishlistItem): product is Product {
    return (product as Product).variants !== undefined;
  }

  static generateUrlFor(item: Product | LineItem | WishlistItem) {
    if (ProductRouter.isProduct(item)) {
      // If the item is a product, we want to generate a url for a matching variant or the first variant if no matching variant is found
      const variant = item.variants.find((variant) => variant.isMatchingVariant !== false) ?? item.variants[0];
      return `/${item.slug}/p/${variant.sku}`;
    }
    return `/${item.productSlug}/p/${item.variant?.sku}`;
  }

  static skuFromUrl = (request: Request) => {
    const urlMatches = getPath(request)?.match(/\/p\/([^\/]+)/);
    if (urlMatches) {
      return urlMatches[1];
    }
    return undefined;
  };

  static identifyFrom(request: Request) {
    if (ProductRouter.skuFromUrl(request)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, commercetoolsFrontendContext: Context): Promise<Product> => {
    const productApi = getProductApi(request, commercetoolsFrontendContext);
    const sku = ProductRouter.skuFromUrl(request);

    if (sku) {
      const productQuery: ProductQuery = {
        skus: [sku],
        storeKey: getStoreKey(request),
        distributionChannelId: getDistributionChannelId(request),
        supplyChannelId: getSupplyChannelId(request),
        storeId: getStoreId(request),
        productSelectionId: getProductSelectionId(request),
        accountGroupId: getAccountGroupId(request),
      };

      return productApi.getProduct(productQuery);
    }

    return null;
  };
}
