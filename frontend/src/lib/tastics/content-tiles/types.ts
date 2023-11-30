import { Item, ContentTilesProps } from '@/components/organisms/content-tiles/types';
import { Reference } from '@/types/lib/reference';

export interface Props extends Omit<ContentTilesProps, 'link' | 'items'> {
  asSlider?: boolean;
  link?: string;
  linkReference?: Reference;
  items: Array<
    Omit<Item, 'link'> & {
      link?: string;
      linkReference?: Reference;
    }
  >;
}
