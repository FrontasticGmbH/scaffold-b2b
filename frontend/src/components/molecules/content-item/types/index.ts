import { Image } from '@/types/image';
import { Link } from '@/types/link';

export type Variant = 'default' | 'inline';

export interface ContentItemProps {
  image: Image;
  title?: string;
  variant?: Variant;
  link?: Link;
}
