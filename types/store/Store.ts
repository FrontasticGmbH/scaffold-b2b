import { Channel } from './Channel';

export interface Store {
  storeId?: string;
  key?: string;
  name?: string;
  distributionChannels?: Channel[];
  supplyChannels?: Channel[];
  productSelectionIds?: string[];
}
