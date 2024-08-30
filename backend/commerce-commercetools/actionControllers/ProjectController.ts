import { ActionContext, Request, Response } from '@frontastic/extension-types';

import handleError from '@Commerce-commercetools/utils/handleError';
import getProjectApi from '@Commerce-commercetools/utils/apiConstructors/getProjectApi';
import extractRegionFromCommercetoolsHostUrl from '@Commerce-commercetools/utils/extractRegionFromCommercetoolsHostUrl';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getProjectSettings: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const projectApi = getProjectApi(request, actionContext.frontasticContext);
    const project = await projectApi.getProjectSettings();

    const region = extractRegionFromCommercetoolsHostUrl(actionContext.frontasticContext);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify({ ...project, region }),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
