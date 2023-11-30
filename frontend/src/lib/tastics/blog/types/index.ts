import { BlogProps } from '@/components/molecules/blog/types';
import { Reference } from '@/types/lib/reference';

export interface Props extends Omit<BlogProps, 'link'> {
  link?: Reference;
  linkName?: string;
}
