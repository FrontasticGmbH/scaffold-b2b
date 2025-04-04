import { Image } from '@/types/image';
import { Link } from '@/types/link';

export interface HeroTileProps {
  image?: Image;
  title?: string;
  links?: Link[];
  isPriority?: boolean;
  imageQuality: number;
}
