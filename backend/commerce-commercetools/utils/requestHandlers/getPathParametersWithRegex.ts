import { Request } from '@frontastic/extension-types';
import { getPath } from '@Commerce-commercetools/utils/requestHandlers/Request';

const getPathParametersWithRegex = (request: Request, expression: RegExp | RegExp[]) => {
  const path = getPath(request);
  if (!path) return null;

  const urlMatches = Array.isArray(expression)
    ? expression.map((exp) => path.match(exp)).find((match) => match !== null)
    : path.match(expression);

  return urlMatches || null;
};

export default getPathParametersWithRegex;
