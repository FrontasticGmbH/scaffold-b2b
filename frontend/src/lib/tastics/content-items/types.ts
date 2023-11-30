import { ContentItemsProps, Item } from '@/components/organisms/content-items/types';
import { Reference } from '@/types/lib/reference';

export interface Props extends Omit<ContentItemsProps, 'link'> {
  link?: string;
  linkReference?: Reference;
  items: Array<Item & { link: Reference }>;
}
