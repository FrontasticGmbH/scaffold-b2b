import { ContentItemProps, Variant } from '@/components/molecules/content-item/types';
import { Link } from '@/types/link';

export type Item = Pick<ContentItemProps, 'image' | 'title'>;

export interface ContentItemsProps {
  title?: string;
  link: Link;
  items: Item[];
  variant?: Variant;
}
