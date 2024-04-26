import { Context, Request } from '@frontastic/extension-types';
import { CategoryQuery } from '@Types/query/CategoryQuery';
import { Category } from '@Types/product/Category';
import { ProductPaginatedResult } from '@Types/result';
import { getPath } from '../requestHandlers/Request';
import { ProductQueryFactory } from '../ProductQueryFactory';
import getProductApi from '@Commerce-commercetools/utils/apiConstructors/getProductApi';

export default class CategoryRouter {
  static identifyPreviewFrom(request: Request) {
    if (getPath(request)?.match(/\/preview\/(.+)/)) {
      return true;
    }

    return false;
  }

  static identifyFrom(request: Request) {
    if (getPath(request)?.match(/[^/]+(?=\/$|$)/)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, commercetoolsFrontendContext: Context): Promise<ProductPaginatedResult> => {
    const productApi = getProductApi(request, commercetoolsFrontendContext);

    // We are using the last subdirectory of the path to identify the category slug
    const urlMatches = getPath(request)?.match(/[^/]+(?=\/$|$)/);

    if (urlMatches) {
      const categoryQuery: CategoryQuery = {
        slug: urlMatches[0],
      };

      const categoryQueryResult = await productApi.queryCategories(categoryQuery);

      if (categoryQueryResult.items.length == 0) return null;
      request.query.category = (categoryQueryResult.items[0] as Category).categoryId;

      const productQuery = ProductQueryFactory.queryFromParams({
        ...request,
      });

      return await productApi.query(productQuery);
    }

    return null;
  };

  static loadPreviewFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<ProductPaginatedResult> => {
    const productApi = getProductApi(request, commercetoolsFrontendContext);

    const urlMatches = getPath(request)?.match(/\/preview\/(.+)/);

    if (urlMatches) {
      const categoryQuery: CategoryQuery = {
        slug: urlMatches[1],
      };

      const categoryQueryResult = await productApi.queryCategories(categoryQuery);

      if (categoryQueryResult.items.length == 0) return null;
      request.query.category = (categoryQueryResult.items[0] as Category).categoryId;

      const productQuery = ProductQueryFactory.queryFromParams({
        ...request,
      });

      return await productApi.query(productQuery);
    }

    return null;
  };
}
