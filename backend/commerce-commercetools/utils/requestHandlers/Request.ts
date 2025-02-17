import { Request } from '@frontastic/extension-types';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import parseQueryParams from '@Commerce-commercetools/utils/requestHandlers/parseRequestParams';

enum requestHeaders {
  'commercetoolsFrontendPath' = 'commercetools-frontend-path',
  'frontasticPath' = 'frontastic-path',
  'commercetoolsFrontendLocale' = 'commercetools-frontend-locale',
  'frontasticLocale' = 'frontastic-locale',
  'commercetoolsFrontendCurrency' = 'commercetools-frontend-currency',
  'frontasticCurrency' = 'frontastic-currency',
}

export const getPath = (request: Request): string | null => {
  return (
    getHeader(request, [requestHeaders.frontasticPath, requestHeaders.commercetoolsFrontendPath]) ?? request.query.path
  );
};

export const getLocale = (request: Request): string => {
  const locale =
    getHeader(request, [requestHeaders.commercetoolsFrontendLocale, requestHeaders.frontasticLocale]) ??
    request.query.locale;

  if (locale !== undefined) {
    return locale;
  }

  throw new ValidationError({ message: `Locale is missing from request ${request}` });
};

export const getCurrency = (request: Request): string | null => {
  if (request !== undefined) {
    const currency =
      getHeader(request, [requestHeaders.commercetoolsFrontendCurrency, requestHeaders.frontasticCurrency]) ??
      request.query['currency'];

    if (currency !== undefined) {
      return currency;
    }
  }

  return null;
};

const getHeader = (request: Request, headers: string[]): string | null => {
  for (const header of headers) {
    const foundHeader = request.headers[header.toLowerCase()];
    if (foundHeader !== undefined) {
      if (Array.isArray(foundHeader)) {
        return foundHeader[0];
      }
      return foundHeader;
    }
  }

  return null;
};

export const getBusinessUnitKey = (request: Request): string | null => {
  if (request !== undefined) {
    const { businessUnitKey } = parseQueryParams<{
      businessUnitKey: string;
    }>(request.query);

    return businessUnitKey ?? request.sessionData?.businessUnitKey;
  }

  return null;
};

export const getStoreKey = (request: Request): string | null => {
  if (request !== undefined) {
    const { storeKey } = parseQueryParams<{
      storeKey: string;
    }>(request.query);

    return storeKey ?? request.sessionData?.storeKey;
  }

  return null;
};

export const getStoreId = (request: Request): string | null => {
  if (request !== undefined) {
    const { storeId } = parseQueryParams<{
      storeId: string;
    }>(request.query);

    return storeId ?? request.sessionData?.storeId;
  }

  return null;
};

export const getDistributionChannelId = (request: Request): string | null => {
  if (request !== undefined) {
    const { distributionChannelId } = parseQueryParams<{
      distributionChannelId: string;
    }>(request.query);

    return distributionChannelId ?? request.sessionData?.distributionChannelId;
  }

  return null;
};

export const getSupplyChannelId = (request: Request): string | null => {
  if (request !== undefined) {
    const { supplyChannelId } = parseQueryParams<{
      supplyChannelId: string;
    }>(request.query);

    return supplyChannelId ?? request.sessionData?.supplyChannelId;
  }

  return null;
};

export const getAccountGroupId = (request: Request): string | null => {
  if (request !== undefined) {
    const { accountGroupId } = parseQueryParams<{
      accountGroupId: string;
    }>(request.query);
    return accountGroupId ?? request.sessionData?.account?.accountGroupId;
  }

  return null;
};
