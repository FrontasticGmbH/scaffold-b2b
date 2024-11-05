import { Locale } from '@/project.config';

export type Params<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  locale: Locale;
  slug: string[];
  [key: string]: string | string[] | undefined;
};

export type SearchParams = Record<string, string>;

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
  params: Params<T>;
  searchParams: SearchParams;
}

export type LayoutProps = React.PropsWithChildren<Pick<PageProps, 'params'>>;
