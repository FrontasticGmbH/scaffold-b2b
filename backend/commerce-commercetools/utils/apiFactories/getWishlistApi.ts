import { Context, Request } from '@frontastic/extension-types';
import {
  getBusinessUnitKey,
  getCurrency,
  getDistributionChannelId,
  getLocale,
  getSupplyChannelId,
} from '../requestHandlers/Request';
import { AccountFetcher } from '../AccountFetcher';
import WishlistApi from '@Commerce-commercetools/apis/WishlistApi';

const getWishlistApi = (request: Request, actionContext: Context): WishlistApi => {
  const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
  const distributionChannelId = getDistributionChannelId(request);
  const supplyChannelId = getSupplyChannelId(request);
  const businessUnitKey = getBusinessUnitKey(request);

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
