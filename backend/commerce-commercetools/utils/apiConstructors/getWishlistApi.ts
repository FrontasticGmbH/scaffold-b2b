import { Context, Request } from '@frontastic/extension-types';
import {
  getBusinessUnitKey,
  getCurrency,
  getDistributionChannelId,
  getLocale,
  getSupplyChannelId,
} from '../requestHandlers/Request';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import WishlistApi from '@Commerce-commercetools/apis/WishlistApi';
import { fetchAccountFromSession } from '../fetchAccountFromSession';

const getWishlistApi = (request: Request, actionContext: Context): WishlistApi => {
  assertIsAuthenticated(request);
  const distributionChannelId = getDistributionChannelId(request);
  const supplyChannelId = getSupplyChannelId(request);
  const businessUnitKey = getBusinessUnitKey(request);
  const accountId = fetchAccountFromSession(request).accountId;

  return new WishlistApi(
    actionContext,
    getLocale(request),
    getCurrency(request),
    accountId,
    distributionChannelId,
    supplyChannelId,
    businessUnitKey,
  );
};

export default getWishlistApi;
