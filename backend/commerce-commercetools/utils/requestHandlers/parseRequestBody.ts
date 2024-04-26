const parseRequestBody = <T>(body?: string): T | null => {
  try {
    if (!body) {
      return null;
    }
    return JSON.parse(body) as T;
  } catch (error) {
    console.error('Error parsing request body', error);
    return null;
  }
};

export default parseRequestBody;
