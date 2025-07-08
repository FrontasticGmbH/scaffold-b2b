import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { QueryParams } from '@Commerce-commercetools/interfaces/QueryParams';

const queryParamsToSortAttributes = (queryParams: QueryParams) => {
  const sortAttributes: SortAttributes = {};

  if (queryParams.sortAttributes) {
    let sortAttribute;

    for (sortAttribute of Object.values(queryParams.sortAttributes)) {
      const key = Object.keys(sortAttribute)[0];
      sortAttributes[key] = sortAttribute[key] ? sortAttribute[key] : SortOrder.ASCENDING;
    }
  }

  return sortAttributes;
};

export default queryParamsToSortAttributes;
