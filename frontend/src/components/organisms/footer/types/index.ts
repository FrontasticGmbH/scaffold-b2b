import { Link } from '@/types/link';

export type Variant = 'default' | 'simple';

export interface FooterProps {
  links?: Link[];
  copyrightStatement?: string;
  variant?: Variant;
}
