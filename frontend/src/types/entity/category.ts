import { Locale } from '@/project.config';

export interface Category {
  categoryId: string;
  categoryKey?: string;
  categoryRef?: string;
  name: string;
  path: string;
  paths: Partial<Record<Locale, string>>;
  descendants: Category[];
}
