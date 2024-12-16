import { Image } from '@/types/image';
import { Link } from '@/types/link';

export interface ContentTileProps {
  title?: string;
  link?: Link;
  image?: Image;
  imageSizes?: string;
}
