import type { Locale } from '@/project.config';

declare global {
  namespace NextNavigation {
    interface Params {
      locale?: Locale;
      slug?: string[];
      [key: string]: string | string[] | undefined;
    }
  }
}

export {};
