import { Locale } from '@/project.config';

// Layout params only include locale (from /[locale]/layout.tsx)
export type LayoutParams = {
  locale: Locale;
};

// Page params include both locale and slug (from /[locale]/[[...slug]]/page.tsx)
export type Params<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  locale: Locale;
  slug: string[];
  [key: string]: string | string[] | undefined;
};

export type SearchParams = Record<string, string>;

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
  params: Promise<Params<T>>;
  searchParams: Promise<SearchParams>;
}

// Layout props only get LayoutParams (locale only)
export type LayoutProps = React.PropsWithChildren<{
  params: Promise<LayoutParams>;
}>;
