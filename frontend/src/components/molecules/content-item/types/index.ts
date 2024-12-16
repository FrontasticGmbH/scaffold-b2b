import { Image } from '@/types/image';
import { Link } from '@/types/link';

export type Variant = 'default' | 'inline';

export interface ContentItemProps {
  image: Image;
  imageSizes?: string;
  title?: string;
  variant?: Variant;
  link?: Link;
}
