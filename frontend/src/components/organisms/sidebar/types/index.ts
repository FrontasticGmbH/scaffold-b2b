import { Link } from '@/types/link';

export interface SidebarProps {
  title?: string;
  links?: Array<Link & { isActive?: boolean }>;
}
