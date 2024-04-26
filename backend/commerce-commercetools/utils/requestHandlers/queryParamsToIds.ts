/**
 * Converts a specified query parameter into an array of IDs.
 *
 * This function takes a specific parameter name and a query parameters object,
 * and transforms the value(s) associated with that parameter name into an array
 * of IDs. If the parameter is already an array, it is returned as is. If it's a
 * string, the function attempts to split it by commas into multiple IDs. If the
 * parameter is a single value (not comma-separated), it is wrapped in an array.
 *
 * @param {string} param - The name of the parameter in the query parameters to convert.
 * @param {Object} queryParams - The object containing the query parameters.
 * @returns {string[]} An array of IDs derived from the query parameter.
 * @example
 * // For queryParams = { userIds: "123,456" }
 * queryParamsToIds('userIds', queryParams); // returns ['123', '456']
 *
 * // For queryParams = { userIds: ["123", "456"] }
 * queryParamsToIds('userIds', queryParams); // returns ["123", "456"]
 */

function queryParamsToIds(param: string, queryParams: any) {
  const paramIds: string[] = [];

  const requestParamIds = queryParams?.[param];

  if (requestParamIds) {
    if (Array.isArray(requestParamIds)) {
      paramIds.push(...requestParamIds);
    } else {
      const params = requestParamIds.split(',');
      if (params.length > 1) {
        paramIds.push(...params);
      } else {
        paramIds.push(requestParamIds);
      }
    }
  }

  return paramIds;
}

export default queryParamsToIds;
