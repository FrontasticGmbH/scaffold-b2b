import { HeaderProps } from '@/components/organisms/header/types';
import { Reference } from '@/types/lib/reference';

interface LinkReference {
  name?: string;
  href?: Reference;
}
export interface HeaderTasticProps extends Omit<HeaderProps, 'cartLink' | 'accountLink' | 'pageLinks' | 'logoLink'> {
  cartLink: Reference;
  accountLink: Reference;
  pageLinks: LinkReference[];
  logoLink: Reference;
}
