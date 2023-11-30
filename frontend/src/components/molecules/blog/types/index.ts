import { Image } from '@/types/image';
import { Link } from '@/types/link';

export interface BlogProps {
  image?: Image;
  title?: string;
  description?: string;
  link: Link;
}
