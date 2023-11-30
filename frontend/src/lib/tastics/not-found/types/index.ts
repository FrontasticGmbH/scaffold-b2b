import { NotFoundProps } from '@/components/pages/not-found/types';
import { Reference } from '@/types/lib/reference';

export interface Props extends Omit<NotFoundProps, 'link'> {
  link?: Reference;
  linkName?: string;
}
