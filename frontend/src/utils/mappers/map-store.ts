import { Store } from '@shared/types/store';
import { Store as EntityStore } from '@/types/entity/business-unit';

export const mapStore = ({ storeId, key, name }: Store): EntityStore => {
  return { id: storeId ?? key, key, name: name ?? key };
};
