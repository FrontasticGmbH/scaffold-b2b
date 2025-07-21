import { Context, Request } from '@frontastic/extension-types';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/requestHandlers/Request';
import ProjectApi from '@Commerce-commercetools/apis/ProjectApi';

const getProjectApi = (request: Request, frontasticContext: Context): ProjectApi => {
  const locale = getLocale(request);
  const currency = getCurrency(request);

  return new ProjectApi(frontasticContext, locale, currency);
};

export default getProjectApi;
