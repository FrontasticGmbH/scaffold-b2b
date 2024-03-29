import { Request } from '@frontastic/extension-types';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

const handleError = (error: ExternalError | Error | unknown, request?: Request) => {
  if (error instanceof ExternalError) {
    const statusCode = error.statusCode ?? 400;

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        statusCode: statusCode,
        message: error.message,
      }),
      sessionData: request?.sessionData,
    };
  }

  const errorResponse = error as Error;

  return {
    statusCode: 500,
    body: JSON.stringify({
      statusCode: 500,
      message: errorResponse?.message,
    }),
    sessionData: request?.sessionData,
  };
};

export default handleError;
