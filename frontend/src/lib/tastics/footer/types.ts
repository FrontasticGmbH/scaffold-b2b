import { FooterProps } from '@/components/organisms/footer/types';
import { Reference } from '@/types/lib/reference';

export interface Props extends Omit<FooterProps, 'links'> {
  links: Array<{
    name?: string;
    href?: Reference;
  }>;
}
