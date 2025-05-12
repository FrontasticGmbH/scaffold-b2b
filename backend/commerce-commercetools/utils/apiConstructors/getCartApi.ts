import { Context, Request } from '@frontastic/extension-types';
import CartApi from '../../apis/CartApi';
import {
  getBusinessUnitKey,
  getCurrency,
  getDistributionChannelId,
  getLocale,
  getSupplyChannelId,
} from '../requestHandlers/Request';
import { AccountFetcher } from '../AccountFetcher';

const getCartApi = (request: Request, actionContext: Context): CartApi => {
  const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
  const businessUnitKey = getBusinessUnitKey(request);
  const distributionChannelId = getDistributionChannelId(request);
  const supplyChannelId = getSupplyChannelId(request);

  return new CartApi(
    actionContext,
    getLocale(request),
    getCurrency(request),
    accountId,
    businessUnitKey,
    distributionChannelId,
    supplyChannelId,
    request,
  );
};

export default getCartApi;
