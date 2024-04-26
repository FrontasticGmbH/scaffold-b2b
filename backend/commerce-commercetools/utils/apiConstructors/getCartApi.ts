import { Context, Request } from '@frontastic/extension-types';
import CartApi from '../../apis/CartApi';
import { fetchAccountFromSession } from '../fetchAccountFromSession';
import {
  getBusinessUnitKey,
  getCurrency,
  getDistributionChannelId,
  getLocale,
  getSupplyChannelId,
} from '../requestHandlers/Request';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';

const getCartApi = (request: Request, actionContext: Context): CartApi => {
  assertIsAuthenticated(request);
  const account = fetchAccountFromSession(request);
  const businessUnitKey = getBusinessUnitKey(request);
  const distributionChannelId = getDistributionChannelId(request);
  const supplyChannelId = getSupplyChannelId(request);

  return new CartApi(
    actionContext,
    getLocale(request),
    getCurrency(request),
    account.accountId,
    businessUnitKey,
    distributionChannelId,
    supplyChannelId,
  );
};

export default getCartApi;
