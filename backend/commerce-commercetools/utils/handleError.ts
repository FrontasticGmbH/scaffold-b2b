import { Request } from '@frontastic/extension-types';
import { ExtensionError } from '@Commerce-commercetools/errors/Errors';

const handleError = (error: ExtensionError | Error | unknown, request?: Request) => {
  if (error instanceof ExtensionError) {
    const statusCode = error.statusCode ?? 503;

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        statusCode: statusCode,
        message: error.message,
      }),
      message: error.message,
      sessionData: request?.sessionData,
      ok: false,
    };
  }

  const errorResponse = error as Error;

  return {
    statusCode: 500,
    body: JSON.stringify({
      statusCode: 500,
      message: errorResponse?.message,
    }),
    message: errorResponse?.message,
    sessionData: request?.sessionData,
    ok: false,
  };
};

export default handleError;
