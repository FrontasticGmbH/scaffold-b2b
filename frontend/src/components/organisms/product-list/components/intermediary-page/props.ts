import { Image } from '@/types/image';
import { Link } from '@/types/link';
import { Currency } from '@/types/currency';
import { CategoryBreadcrumb } from '../../types';

interface Highlight {
  headline?: string;
  subline?: string;
  cta: Link;
  items: Array<{
    name: string;
    price: number;
    currency: Currency;
    url: string;
    image: Image;
    pressTargetPosition: 'top' | 'bottom';
  }>;
}

export interface Props {
  title: string;
  link: Link;
  breadcrumb: Array<CategoryBreadcrumb>;
  items: Array<{ name?: string; image?: Image; url?: string }>;
  highlight: Highlight;
}
