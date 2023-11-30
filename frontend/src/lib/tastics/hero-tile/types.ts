import { HeroTileProps } from '@/components/organisms/hero-tile/types';
import { Reference } from '@/types/lib/reference';

export interface Props extends Omit<HeroTileProps, 'links'> {
  links: Array<{
    name?: string;
    href?: Reference;
  }>;
}
