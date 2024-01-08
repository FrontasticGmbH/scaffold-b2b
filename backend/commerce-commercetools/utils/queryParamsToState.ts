/**
 * Converts query parameters to an array of states.
 *
 * This function takes a specific parameter name and a query parameter object,
 * and transforms the value(s) associated with the parameter name into an array
 * of states. If the parameter is already an array, it is returned as is.
 * If it's a string, the function attempts to split it by commas and returns
 * the resulting array. If the parameter is a single value (not comma-separated),
 * it is wrapped in an array.
 *
 * @template T The type of elements that the resulting array will contain.
 * @param {string} param The name of the parameter in the query parameters to convert.
 * @param {Object} queryParams The object containing the query parameters.
 * @return {T[]} An array of states derived from the query parameter.
 * @example
 * // For queryParams = { status: "active,inactive" }
 * queryParamsToStates('status', queryParams); // returns ['active', 'inactive']
 *
 * // For queryParams = { status: ["active", "inactive"] }
 * queryParamsToStates('status', queryParams); // returns ["active", "inactive"]
 */
const queryParamsToStates = <T>(param: string, queryParams: any): T[] => {
  const states: T[] = [];

  const requestParamStates = queryParams?.[param];

  if (requestParamStates) {
    if (Array.isArray(requestParamStates)) {
      states.push(...requestParamStates);
    } else {
      const params = requestParamStates.split(',');
      if (params.length > 1) {
        states.push(...params);
      } else {
        states.push(requestParamStates);
      }
    }
  }

  return states;
};

export default queryParamsToStates;
