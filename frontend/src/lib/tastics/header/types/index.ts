import { HeaderProps } from '@/components/organisms/header/types';
import { Reference } from '@/types/lib/reference';

interface LinkReference {
  name?: string;
  href?: Reference;
}

interface AccountLink {
  linkId: string;
  name: string;
  href: Reference;
}
export interface HeaderTasticProps extends Omit<HeaderProps, 'cartLink' | 'accountLink' | 'pageLinks' | 'logoLink'> {
  textBar: string;
  cartLink: Reference;
  accountLinkId: string;
  accountLinkLabel: string;
  accountLink: Reference;
  pageLinks: LinkReference[];
  logoLink: Reference;
  accountPageLinks: AccountLink[];
}
