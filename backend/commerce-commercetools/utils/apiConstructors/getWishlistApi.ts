import { Context, Request } from '@frontastic/extension-types';
import { getCurrency, getDistributionChannelId, getLocale, getSupplyChannelId } from '../requestHandlers/Request';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import WishlistApi from '@Commerce-commercetools/apis/WishlistApi';

const getWishlistApi = (request: Request, actionContext: Context): WishlistApi => {
  assertIsAuthenticated(request);
  const distributionChannelId = getDistributionChannelId(request);
  const supplyChannelId = getSupplyChannelId(request);

  return new WishlistApi(
    actionContext,
    getLocale(request),
    getCurrency(request),
    distributionChannelId,
    supplyChannelId,
  );
};

export default getWishlistApi;
