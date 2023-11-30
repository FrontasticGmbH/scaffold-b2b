const parseRequestBody = <T>(body: string): T | null => {
  try {
    return JSON.parse(body) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

export default parseRequestBody;
