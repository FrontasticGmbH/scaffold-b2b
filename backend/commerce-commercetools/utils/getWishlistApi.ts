import { Context, Request } from '@frontastic/extension-types';
import { fetchAccountFromSession } from './fetchAccountFromSession';
import { getBusinessUnitKey, getCurrency, getDistributionChannelId, getLocale, getSupplyChannelId } from './Request';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import { WishlistApi } from '@Commerce-commercetools/apis/WishlistApi';

const getWishlistApi = (request: Request, actionContext: Context) => {
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
