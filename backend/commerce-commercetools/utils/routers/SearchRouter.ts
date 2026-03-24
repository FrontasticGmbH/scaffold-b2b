import { Context, Request } from '@frontastic/extension-types';
import { ProductPaginatedResult } from '@Types/result';
import { ProductQueryFactory } from '../ProductQueryFactory';
import { getPath } from '../requestHandlers/Request';
import getProductApi from '@Commerce-commercetools/utils/apiConstructors/getProductApi';

export default class SearchRouter {
  static identifyFrom(request: Request) {
    const urlMatches = getPath(request)?.match(/^\/search/);

    if (urlMatches) {
      return true;
    }

    return false;
  }

  static loadFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<ProductPaginatedResult> | null => {
    const productApi = getProductApi(request, commercetoolsFrontendContext);
    const urlMatches = getPath(request)?.match(/\/search/);

    if (urlMatches) {
      const productQuery = ProductQueryFactory.queryFromParams({
        ...request,
        query: { ...request.query, query: request.query.query || request.query.q },
      });
      return productApi.query(productQuery);
    }

    return null;
  };
}
