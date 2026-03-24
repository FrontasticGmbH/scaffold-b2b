import { Store } from '@shared/types/store';
import { Store as EntityStore } from '@/types/entity/business-unit';

export const mapStore = ({ storeId, key, name }: Store): EntityStore => {
  return { id: storeId as string, key, name: name ?? key ?? '' };
};
